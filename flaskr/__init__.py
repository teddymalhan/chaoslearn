from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:4173"])  # Allow requests from your frontend

    # Register routes
    from .routes import bp
    app.register_blueprint(bp)

    return app