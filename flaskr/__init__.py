from flask import Flask
from .views import bp as main_bp

def create_app():
    app = Flask(__name__)

    # Get the text prompt from the frontend
    # 
    # Get a list of keywords from OpenAI API
    # 
    # Pass that list of keywords to the YouTube API
    # 
    # Make a random list of videos with those keywords, plus a list with an attribute that its a fun video
    # 
    # ['Video1', 'Video2', 'Cat Video', Video1] 

    return app