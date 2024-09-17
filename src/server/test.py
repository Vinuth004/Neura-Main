import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder

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

    # Add preferred foods if they can fit within the calorie budget
    total_calories = sum(int(food['calories']) for food in foods_list if food['recipe_name'] in suggested_foods)
    for food in foods_list:
        if food['recipe_name'].lower() in preferred_foods_list:
            food_calories = int(food['calories'])
            if total_calories + food_calories <= calorie_needs:
                suggested_foods.append(food['recipe_name'])
                total_calories += food_calories

    # Remove allergic foods based on both recipe name and ingredients
    final_suggestions = []
    for food in suggested_foods:
        food_data = next((f for f in foods_list if f['recipe_name'] == food), None)
        if food_data:
            # Check if any allergic food substring exists in the recipe name or ingredients
            ingredients = food_data.get('ingredients', '').lower()
            if not any(allergy in food_data['recipe_name'].lower() for allergy in allergic_foods_list) and \
               not any(allergy in ingredients for allergy in allergic_foods_list):
                final_suggestions.append(food)
            else:
                # Find a replacement food with a wider calorie range (±200 calories for more flexibility)
                tolerance = 200
                replacement = next((f for f in foods_list if f['recipe_name'] not in suggested_foods 
                                    and f['calories'] >= food_data['calories'] - tolerance 
                                    and f['calories'] <= food_data['calories'] + tolerance), None)
                if replacement:
                    final_suggestions.append(replacement['recipe_name'])
                else:
                    print(f"Could not find a replacement for: {food_data['recipe_name']}")

    # If not enough foods are suggested after replacements, add more foods to meet calorie needs
    if sum(int(f['calories']) for f in foods_list if f['recipe_name'] in final_suggestions) < calorie_needs:
        additional_foods = sorted([f for f in foods_list if f['recipe_name'] not in final_suggestions],
                                  key=lambda x: abs(x['calories'] - (calorie_needs / len(final_suggestions))), reverse=True)
        for food in additional_foods:
            if sum(int(f['calories']) for f in foods_list if f['recipe_name'] in final_suggestions) + food['calories'] <= calorie_needs:
                final_suggestions.append(food['recipe_name'])

    # Print each suggested food with its calorie count
    total_calories = 0
    if final_suggestions:
        print("Final Suggested Foods and their Calorie Counts:")
        for food in foods_list:
            if food['recipe_name'] in final_suggestions:
                food_calories = int(food['calories'])
                print(f"{food['recipe_name']}: {food_calories} calories")
                total_calories += food_calories

        print(f"\nTotal Calories of Suggested Foods: {total_calories}")
    else:
        print("No foods matched the calorie needs.")

    return final_suggestions



def main():
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
        'BMR': [3000],
        'activity_factor': [1.5],
        'age': [30]
    })
    
    predicted_calorie_needs = predict_calorie_needs(new_data)
    
    
    # Train a new food filtering model (you can comment this out if you already have a trained model)
    preferred_foods = 'beef,chicken'
    allergic_foods = 'vegetable,mushroom,pasta,oat'
    # Filter foods based on predicted calorie needs
    tolerance = 1000  # Tolerance range for calorie needs
    calorie_needs = int(round(predicted_calorie_needs))
    suggested_foods = suggest_foods(calorie_needs, food_data,preferred_foods,allergic_foods)
    print(f"Predicted Calorie Needs: {predicted_calorie_needs}")
    print(f"Suggested Foods: \n{suggested_foods}")

if __name__ == "__main__":
    main()
