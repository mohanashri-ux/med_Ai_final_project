import numpy as np
import pandas as pd
from sklearn.naive_bayes import MultinomialNB
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

# Load and prepare the training data
train_data = pd.read_csv('Train.csv')

# Encode the target labels in the training data
label_encoder = LabelEncoder()
train_data['prognosis'] = label_encoder.fit_transform(train_data['prognosis'])

# Features and target for training
X_train = train_data.iloc[:, :-1]  # All columns except the last one
y_train = train_data['prognosis']   # The last column

# Initialize the MultinomialNB model
model = MultinomialNB()

# Train the model
model.fit(X_train, y_train)

# Load and prepare the test data
test_data = pd.read_csv('Test.csv')

# Encode the target labels in the test data using the same label encoder
test_data['prognosis'] = label_encoder.transform(test_data['prognosis'])

# Features and target for testing
X_test = test_data.iloc[:, :-1]  # All columns except the last one
y_test = test_data['prognosis']   # The last column

# Predict on the test set
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy on the test set: {accuracy * 100:.2f}%")

# Save the trained model to a file using joblib
joblib.dump(model, 'disease_prediction_odel')
print("Model saved as 'disease_prediction_model'")

