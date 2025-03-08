from flask import Flask, render_template, request, jsonify
import os
import random
from openai import OpenAI
from youtube_search import YoutubeSearch

# Load API key
OPENAI_API_KEY = "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"

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

def get_keywords_from_prompt(prompt):
    """
    Uses OpenAI's chat completion API with model 'gpt-4o-mini' to extract keywords from the prompt.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": f"Extract a list of keywords from the following prompt: {prompt}"}],
            max_tokens=300,
        )
    except Exception as e:
        return {"error": f"Error in GPT-4 call: {str(e)}"}

    result = response.choices[0].message.content.strip()
    keywords = [keyword.strip() for keyword in result.split(",") if keyword.strip()]
    return keywords

def get_youtube_videos_for_keywords(keywords, max_results=5):
    """
    Searches YouTube for videos matching each keyword using YoutubeSearch.
    Returns a list of video dictionaries with title, URL, and is_fun flag.
    """
    videos = []
    for keyword in keywords:
        search_results = YoutubeSearch(keyword, max_results=max_results).to_dict()
        for video in search_results:
            videos.append({
                "title": video["title"],
                "url": f"https://www.youtube.com{video['url_suffix']}",
                "is_fun": False
            })
    return videos

def get_youtube_fun_videos(fun_topic, max_results=3):
    """
    Searches YouTube for fun videos based on the fun topic using YoutubeSearch.
    """
    videos = []
    search_results = YoutubeSearch(fun_topic, max_results=max_results).to_dict()
    for video in search_results:
        videos.append({
            "title": video["title"],
            "url": f"https://www.youtube.com{video['url_suffix']}",
            "is_fun": True
        })
    return videos

def interleave_fun_videos(useful_videos, fun_videos):
    """
    Randomly interleaves the fun videos into the useful videos list.
    """
    combined_videos = useful_videos.copy()
    for fun_video in fun_videos:
        insert_index = random.randint(0, len(combined_videos))
        combined_videos.insert(insert_index, fun_video)
    return combined_videos

def create_app():
    app = Flask(__name__)
    
    @app.route("/")
    def index():
        return render_template("index.html")
    
    @app.route("/process", methods=["POST"])
    def process():
        prompt = request.form.get("prompt")
        fun_topic = request.form.get("fun_topic")
        
        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400
        if not fun_topic:
            return jsonify({"error": "No fun topic provided"}), 400
        
        keywords = get_keywords_from_prompt(prompt)
        if isinstance(keywords, dict) and "error" in keywords:
            return jsonify(keywords), 500
        
        useful_videos = get_youtube_videos_for_keywords(keywords)
        fun_videos = get_youtube_fun_videos(fun_topic)
        
        combined_videos = interleave_fun_videos(useful_videos, fun_videos)
        
        return jsonify(combined_videos)
    
    return app