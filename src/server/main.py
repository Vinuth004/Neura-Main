from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random 

app = Flask(__name__)
CORS(app)  # Allow all CORS requests

def calculate_bmr(gender, weight, height, age):
    if gender.lower() == 'male':
        # BMR formula for men
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    elif gender.lower() == 'female':
        # BMR formula for women
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    else:
        raise ValueError("Invalid gender. Please specify 'male' or 'female'.")
    
    return bmr

@app.route('/calculate_bmr', methods=['POST'])
def calculate_bmr_api():
    try:
        # Parse JSON request body
        data = request.get_json()
        gender = data.get('gender')
        weight = data.get('weight')
        height = data.get('height')
        age = data.get('age')

        # Validate input
        if not all([gender, weight, height, age]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Convert to appropriate types
        weight = float(weight)
        height = float(height)
        age = int(age)

        # Calculate BMR
        bmr = calculate_bmr(gender, weight, height, age)
        
        # Return result as JSON
        return jsonify({"bmr": round(bmr, 2)})

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An error occurred: " + str(e)}), 500






# Load and preprocess the calorie needs dataset
def load_and_preprocess_calorie_data(file_path):
    df = pd.read_csv(file_path)
    X = df[['BMR', 'activity_factor', 'age']]
    y = df['calorie_needs']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
    
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    
    return X_train, X_test, y_train, y_test, scaler

# Load and preprocess the food dataset
def load_and_preprocess_food_data(file_path):
    df = pd.read_csv(file_path)
    df['calories'] = df['calories'].astype(float)
    return df

def suggest_foods(calorie_needs, foods, preferred_foods, allergic_foods):
    # Convert preferred and allergic foods to lists
    preferred_foods_list = [food.strip().lower() for food in preferred_foods.split(',')]
    allergic_foods_list = [food.strip().lower() for food in allergic_foods.split(',')]

    # Ensure 'calories' is a valid number in the food DataFrame
    foods['calories'] = pd.to_numeric(foods['calories'], errors='coerce')

    dp = [None] * (calorie_needs + 1)
    dp[0] = []

    # Convert foods DataFrame to list of dictionaries
    foods_list = foods.to_dict('records')

    for food in foods_list:
        food_calories = int(food['calories'])
        for i in range(calorie_needs, food_calories - 1, -1):
            if dp[i - food_calories] is not None:
                if dp[i] is None or len(dp[i - food_calories]) + 1 < len(dp[i]):
                    dp[i] = dp[i - food_calories] + [food['recipe_name']]

    # Determine the best match or closest match
    suggested_foods = []
    if dp[calorie_needs] is not None:
        suggested_foods = dp[calorie_needs]
    else:
        tolerance = 50  # Define a tolerance level to allow approximate matches
        for i in range(calorie_needs - tolerance, calorie_needs + tolerance + 1):
            if i < len(dp) and dp[i] is not None:
                suggested_foods = dp[i]
                break

    # Set to track unique foods
    unique_foods = set()

    # Add preferred foods if they can fit within the calorie budget
    total_calories = 0
    for food in foods_list:
        if food['recipe_name'].lower() in preferred_foods_list:
            food_calories = int(food['calories'])
            if total_calories + food_calories <= calorie_needs:
                unique_foods.add(food['recipe_name'])
                total_calories += food_calories

    # Remove allergic foods based on both recipe name and ingredients
    final_suggestions = []
    total_suggested_calories = 0
    for food in suggested_foods:
        food_data = next((f for f in foods_list if f['recipe_name'] == food), None)
        if food_data:
            ingredients = food_data.get('ingredients', '').lower()
            if not any(allergy in food_data['recipe_name'].lower() for allergy in allergic_foods_list) and \
               not any(allergy in ingredients for allergy in allergic_foods_list):
                if food_data['recipe_name'] not in unique_foods:
                    final_suggestions.append({
                        'recipe_name': food_data['recipe_name'],
                        'ingredients': food_data.get('ingredients', ''),
                        'image_link': food_data.get('image_link', ''),
                        'carbs': food_data.get('carbs', ''),
                        'proteins': food_data.get('proteins', ''),
                        'calories': food_data.get('calories', ''),
                        'serving_size': food_data.get('serving_size', '')
                    })
                    unique_foods.add(food_data['recipe_name'])
                    total_suggested_calories += float(food_data['calories'])
            else:
                # Find a replacement food with a wider calorie range (±200 calories for more flexibility)
                tolerance = 200
                replacement = next((f for f in foods_list if f['recipe_name'] not in unique_foods and 
                                    f['recipe_name'] != food_data['recipe_name'] and 
                                    f['calories'] >= food_data['calories'] - tolerance and 
                                    f['calories'] <= food_data['calories'] + tolerance), None)
                if replacement:
                    final_suggestions.append({
                        'recipe_name': replacement['recipe_name'],
                        'ingredients': replacement.get('ingredients', ''),
                        'image_link': replacement.get('image_link', ''),
                        'carbs': replacement.get('carbs', ''),
                        'proteins': replacement.get('proteins', ''),
                        'calories': replacement.get('calories', ''),
                        'serving_size': replacement.get('serving_size', '')
                    })
                    unique_foods.add(replacement['recipe_name'])
                    total_suggested_calories += float(replacement['calories'])
                else:
                    print(f"Could not find a replacement for: {food_data['recipe_name']}")

    # If not enough foods are suggested after replacements, add more foods to meet calorie needs
    if total_suggested_calories < calorie_needs:
        additional_foods = sorted([f for f in foods_list if f['recipe_name'] not in unique_foods],
                                  key=lambda x: abs(x['calories'] - (calorie_needs / len(final_suggestions))), reverse=True)
        for food in additional_foods:
            if total_suggested_calories + float(food['calories']) <= calorie_needs:
                final_suggestions.append({
                    'recipe_name': food['recipe_name'],
                    'ingredients': food.get('ingredients', ''),
                    'image_link': food.get('image_link', ''),
                    'carbs': food.get('carbs', ''),
                    'proteins': food.get('proteins', ''),
                    'calories': food.get('calories', ''),
                    'serving_size': food.get('serving_size', '')
                })
                unique_foods.add(food['recipe_name'])
                total_suggested_calories += float(food['calories'])
                
    print(final_suggestions)
    # Build final JSON response
    response = {
        'predicted_calorie_needs': calorie_needs,
        'total_calories': total_suggested_calories,
        'suggested_foods': final_suggestions
    }

    return response





@app.route('/generate_meal', methods=['POST'])
def genMeal():
    try:
        # Parse JSON request body
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data found"}), 400
        
        # Log incoming data
        print("Incoming Data: ", data)

        # Extract and log individual fields
        prefs = data.get('prefer')
        algs = data.get('allergies')
        active_scale = data.get('activeLevel')
        bmrVal = data.get('bmr')
        age = data.get('age')

        print(f"Preferences: {prefs}, Allergies: {algs}, Active Scale: {active_scale}, BMR: {bmrVal}, Age: {age}")

        AS = 0

        # Validate input
        if not all([ active_scale, bmrVal, age]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Convert to appropriate types
        bmrVal = int(bmrVal)
        age = int(age)
        if active_scale == 'sedentary':
            AS = 1.2
        elif active_scale == 'lightly':
            AS = 1.375
        elif active_scale == 'moderately':
            AS = 1.55
        elif active_scale == 'active':
            AS = 1.725
        else:
            return jsonify({"error": "Invalid activity level"}), 400

        # Paths to your datasets
        calorie_file_path = 'large_calorie_needs_dataset.csv'
        food_file_path = 'dataset.csv'

        # Load and preprocess the data
        X_train, X_test, y_train, y_test, scaler = load_and_preprocess_calorie_data(calorie_file_path)
        food_data = load_and_preprocess_food_data(food_file_path)

        # Load the pre-trained calorie needs model
        calorie_model = load_model('calorie_needs_model.h5')

        def predict_calorie_needs(new_data):
            new_data = scaler.transform(new_data)
            predicted_calorie_needs = calorie_model.predict(new_data)
            return predicted_calorie_needs[0][0]

        new_data = pd.DataFrame({
            'BMR': [bmrVal],
            'activity_factor': [AS],
            'age': [age]
        })

        predicted_calorie_needs = predict_calorie_needs(new_data)

        preferred_foods = str(prefs)
        allergic_foods = str(algs)

        # Filter foods based on predicted calorie needs
        tolerance = 1000
        calorie_needs = int(round(predicted_calorie_needs))
        response = suggest_foods(calorie_needs, food_data, preferred_foods, allergic_foods)

        return jsonify(response)

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An error occurred: " + str(e)}), 500



@app.route('/save_suggested_foods', methods=['POST'])
def save_data():
    data = request.get_json()
    suggested_foods = data.get('suggested_foods', [])
    email = data.get('email')
    nameMeal = data.get('nameMeal')

    # Define the file path
    file_path = f'./meals/{email}_{nameMeal}_suggested_foods.json'

    # Write data to JSON file
    with open(file_path, 'w') as json_file:
        json.dump(suggested_foods, json_file, indent=4)

    return jsonify({'status': 'success', 'message': 'Suggested foods saved successfully'})

@app.route('/get_files_by_email', methods=['POST'])
def get_files_by_email():
    data = request.get_json()
    email = data.get('email', '')

    if not email:
        return jsonify({'status': 'error', 'message': 'Email is required'}), 400

    # Path to the directory containing files
    directory = './meals/'
    files = [filename for filename in os.listdir(directory) if email in filename]

    return jsonify({'files': files})

@app.route('/get_file_content', methods=['POST'])
def get_file_content():
    data = request.get_json()
    filename = data.get('filename', '')

    if not filename:
        return jsonify({'status': 'error', 'message': 'Filename is required'}), 400

    # Path to the file
    file_path = os.path.join('./meals/', filename)
    try:
        with open(file_path, 'r') as file:
            content = json.load(file)  # Assuming JSON content
        return jsonify({'content': content})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500




# Configuration for your email
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SENDER_EMAIL = 'vinuth.marasinghe2004@gmail.com'
SENDER_PASSWORD = 'smdu oaay qnth guyx'

def send_recovery_email(recipient_email,random_number):
    try:
        # Set up the server
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        

        # Compose the email
        subject = "Password Recovery"
        body = f"Use this code to recover your account: {random_number}"
        
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = recipient_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send the email
        server.sendmail(SENDER_EMAIL, recipient_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

@app.route('/api/retrieve-password', methods=['POST'])
def retrieve_password():
    data = request.get_json()
    email = data.get('email')
    random_number = random.randint(100000, 999999)
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    # Send recovery email
    if send_recovery_email(email,random_number):
        return jsonify({"message": random_number}), 200
    else:
        return jsonify({"error": "Failed to send recovery email"}), 500


if __name__ == "__main__":
    app.run(debug=True)
