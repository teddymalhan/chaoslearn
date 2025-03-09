from flaskr import create_app
from flask_cors import CORS  # Import CORS

# Create Flask app
app = create_app()

# Enable CORS for all routes
CORS(app, origins=["http://localhost:5173"])  # Allow React frontend

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Explicitly set port 5000