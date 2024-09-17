import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# 1. Load and Preprocess the Data
def load_and_preprocess_data(file_path):
    df = pd.read_csv(file_path)
    X = df[['BMR', 'activity_factor', 'age']]
    y = df['calorie_needs']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
    
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    
    return X_train, X_test, y_train, y_test, scaler

# 2. Build and Train the Neural Network
def build_and_train_model(X_train, y_train):
    model = Sequential([
        Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
        Dense(32, activation='relu'),
        Dense(1)  # Output layer with 1 neuron for regression
    ])
    
    model.compile(optimizer='adam', loss='mean_squared_error')
    
    history = model.fit(X_train, y_train, epochs=50, validation_split=0.2, batch_size=32)
    
    return model, history

# 3. Evaluate the Model
def evaluate_model(model, X_test, y_test, history):
    loss = model.evaluate(X_test, y_test)
    print(f"Test Loss: {loss}")

    # Plot the loss
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.show()

# 4. Save the Model
def save_model(model):
    model.save('calorie_needs_model.h5')

# 5. Load the Model and Make Predictions
def load_model_and_predict(scaler, new_data):
    model = load_model('calorie_needs_model.h5')
    new_data = scaler.transform(new_data)
    predicted_calorie_needs = model.predict(new_data)
    return predicted_calorie_needs[0][0]

# Main function
def main():
    # File path to your dataset
    file_path = 'large_calorie_needs_dataset.csv'
    
    # Load and preprocess the data
    X_train, X_test, y_train, y_test, scaler = load_and_preprocess_data(file_path)
    
    # Build and train the model
    model, history = build_and_train_model(X_train, y_train)
    
    # Save the model
    save_model(model)
    
    # Evaluate the model
    evaluate_model(model, X_test, y_test, history)
    
    # Example input data for prediction
    new_data = pd.DataFrame({
        'BMR': [1000],
        'activity_factor': [1.5],
        'age': [30]
    })
    
    # Load model and make predictions
    predicted_calorie_needs = load_model_and_predict(scaler, new_data)
    print(f"Predicted Calorie Needs: {predicted_calorie_needs}")

if __name__ == "__main__":
    main()
