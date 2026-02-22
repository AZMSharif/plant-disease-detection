from flask import Flask, render_template, request, redirect, url_for
import os
from werkzeug.utils import secure_filename
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import PIL

# Initialize Flask app
app = Flask(__name__)

# Folder for uploading images
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Load the trained model
model = load_model('model.h5')  # Ensure the model file is in the same directory or provide the correct path

# Class labels (adjust according to your dataset)
labels = {0: "Healthy", 1: "Powdery Mildew", 2: "Rust"}

# Function to check allowed file types
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Home route
@app.route('/')
def index():
    return render_template('index.html')

# Prediction route
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return redirect(request.url)

    file = request.files['file']

    if file.filename == '':
        return redirect(request.url)

    if file and allowed_file(file.filename):
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        file.save(filepath)

        # Preprocess the image
        img = image.load_img(filepath, target_size=(224, 224))  # Resize the image
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array.astype('float32') / 255.0  # Normalize

        # Make a prediction
        predictions = model.predict(img_array)
        predicted_label = np.argmax(predictions)
        confidence = np.max(predictions) * 100

        # Map predicted label to class name
        label = labels[predicted_label]

        return render_template('result.html', label=label, confidence=f"{confidence:.1f}", filename=filename)

    return redirect(request.url)

if __name__ == '__main__':
    app.run(debug=True)
