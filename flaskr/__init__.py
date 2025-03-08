from flask import Flask, render_template, request, jsonify
import os
import random
import openai
from googleapiclient.discovery import build

YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")

# Set up OpenAI API key
openai.api_key = OPENAI_API_KEY

def get_keywords_from_prompt(prompt):
    """
    Uses OpenAI's chat completion API with model 'gpt-4o-mini' to extract keywords from the prompt.
    """
    try:
        response = openai.chat.completion.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f"Extract a list of keywords from the following prompt: {prompt}"}
                    ],
                }
            ],
            max_tokens=300,
        )
    except Exception as e:
        # Here we use a simple Flask error response instead of HTTPException from FastAPI
        return {"error": f"Error in GPT-4 call: {str(e)}"}

    result = response.choices[0].message.content.strip()
    # Assuming the response returns keywords separated by commas
    keywords = [keyword.strip() for keyword in result.split(",") if keyword.strip()]
    return keywords

def get_youtube_videos_for_keywords(keywords, max_results=5):
    """
    Searches the YouTube API for videos matching each keyword.
    Returns a list of video dictionaries with title, URL, and is_fun flag.
    """
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
    videos = []
    for keyword in keywords:
        search_response = youtube.search().list(
            q=keyword,
            part="id,snippet",
            maxResults=max_results,
            type="video"
        ).execute()
        for item in search_response.get("items", []):
            video_title = item["snippet"]["title"]
            video_id = item["id"]["videoId"]
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            videos.append({
                "title": video_title,
                "url": video_url,
                "is_fun": False  # Mark as a useful video
            })
    return videos

def get_youtube_fun_videos(fun_topic, max_results=3):
    """
    Searches the YouTube API for fun videos based on the fun topic.
    Returns a list of video dictionaries with title, URL, and is_fun flag.
    """
    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
    fun_videos = []
    search_response = youtube.search().list(
        q=fun_topic,
        part="id,snippet",
        maxResults=max_results,
        type="video"
    ).execute()
    for item in search_response.get("items", []):
        video_title = item["snippet"]["title"]
        video_id = item["id"]["videoId"]
        video_url = f"https://www.youtube.com/watch?v={video_id}"
        fun_videos.append({
            "title": video_title,
            "url": video_url,
            "is_fun": True  # Mark as a fun video
        })
    return fun_videos

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
        
        # Extract keywords using GPT-4 mini chat model
        keywords = get_keywords_from_prompt(prompt)
        if isinstance(keywords, dict) and keywords.get("error"):
            return jsonify(keywords), 500
        
        # Get useful videos from YouTube using the extracted keywords
        useful_videos = get_youtube_videos_for_keywords(keywords)
        
        # Get fun videos using the provided fun topic
        fun_videos = get_youtube_fun_videos(fun_topic)
        
        # Interleave fun videos into the useful videos list
        combined_videos = interleave_fun_videos(useful_videos, fun_videos)
        
        # Return a JSON list of video links with titles and is_fun flag
        video_links = [{
            "title": video["title"],
            "url": video["url"],
            "is_fun": video["is_fun"]
        } for video in combined_videos]
        
        return jsonify(video_links)
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)

    # # Get the text prompt from the frontend
    # # 

    # # Get a list of keywords from OpenAI API
    # # 
    # # Pass that list of keywords to the YouTube API
    # # 
    # # Make a random list of videos with those keywords, plus a list with an attribute that its a fun video
    # # 
    # # ['Video1', 'Video2', 'Cat Video', Video1] 

    # return app