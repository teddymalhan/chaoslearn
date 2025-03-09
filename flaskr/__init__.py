from flask import Flask, render_template, request, jsonify
import os
import random
from openai import OpenAI
import yt_dlp  # Using yt_dlp as an alternative to youtubei
from flask_cors import CORS  

# Load API key from environment variable
OPENAI_API_KEY = 

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

def get_keywords_from_prompt(prompt):
    """
    Uses OpenAI's chat completion API with model 'gpt-4o-mini' to generate an ordered lesson plan with YouTube-searchable keywords.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user",
                "content": f"""
                Create an **ordered lesson plan** with different keywords that can be searched on YouTube to generate a complete video series lesson plan for the given topic.

                - **Ensure that each keyword is unique and distinct.**
                - **Each keyword should focus on a different concept, application, or technical detail.**
                - **Ensure that the keywords are commonly searched on YouTube and yield different video results.**
                
                **Return the lesson plan as an ordered list in a single string, with each lesson separated by commas.**

                Now generate a lesson plan for this topic: **{prompt}**
                """
            }],
            max_tokens=300,
        )
    except Exception as e:
        return {"error": f"Error in GPT-4 call: {str(e)}"}

    result = response.choices[0].message.content.strip()
    keywords = list(dict.fromkeys([keyword.strip() for keyword in result.split(",") if keyword.strip()]))  # Remove duplicates
    return keywords

def search_youtube_videos(query, max_results=5, duration_filter=None, is_fun=False):
    """
    Uses yt_dlp to search for YouTube videos based on the query.
    Filters based on duration and ensures that fun videos are marked correctly.
    """
    ydl_opts = {
        "quiet": True,
        "extract_flat": True,  # Extract metadata without downloading
        "force_generic_extractor": True,
        "default_search": "ytsearch",
        "max_downloads": max_results,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        search_results = ydl.extract_info(f"ytsearch{max_results}:{query}", download=False)

    videos = []
    seen_titles = set()  # To store unique video titles and prevent duplicates

    for entry in search_results.get("entries", []):
        video_title = entry.get("title")
        video_url = entry.get("url")
        video_channel = entry.get("channel", "Unknown Channel")  # Fetch channel name
        duration = entry.get("duration", 0)  # Duration in seconds

        # **Filter by duration for study videos**
        if not is_fun:
            if duration_filter == "short" and duration >= 240:  # Less than 4 minutes
                continue
            if duration_filter == "medium" and (duration < 240 or duration > 1200):  # 4-20 minutes
                continue
            if duration_filter == "long" and duration <= 1200:  # More than 20 minutes
                continue

        # **Ensure fun videos are Shorts (less than 60s)**
        if is_fun and duration >= 60:
            continue

        # **Avoid duplicate titles**
        if video_title in seen_titles:
            continue

        seen_titles.add(video_title)
        videos.append({
            "title": video_title,
            "url": video_url,
            "channel": video_channel,
            "is_fun": is_fun
        })

    return videos

def get_youtube_fun_videos(fun_topic, max_results=3):
    """
    Uses yt_dlp to search for fun YouTube Shorts (videos under 60 seconds).
    """
    return search_youtube_videos(fun_topic, max_results=max_results, is_fun=True)

def get_youtube_videos_for_keywords(keywords, max_results=5, duration="medium"):
    """
    Uses yt_dlp to search for educational videos on YouTube for each keyword, filtered by duration.
    """
    videos = []
    for keyword in keywords:
        videos.extend(search_youtube_videos(keyword, max_results=max_results, duration_filter=duration, is_fun=False))
    return videos


def get_subtitles(youtube_id):
     url = f"https://www.youtube.com/watch?v={youtube_id}"
     ydl_opts = {
         "skip_download": True,
         "writesubtitles": True,
         "subtitleslangs": ['en'],
     }
     with yt_dlp.YoutubeDL(ydl_opts) as ydl:
         info = ydl.extract_info(url, download=False)
         subtitles = info.get('subtitles', {})
         en_subtitles = subtitles.get('en', [])
         if en_subtitles:
             # Fetch the URL of the English subtitles
             subtitle_url = en_subtitles[0].get('url')
             if subtitle_url:
                 # Download the subtitle content
                 import requests
                 response = requests.get(subtitle_url)
                 if response.status_code == 200:
                     return response.text
                 else:
                     raise Exception(f"Failed to download subtitles: {response.status_code}")
         raise Exception("No English subtitles found.")
 
def create_quiz(subtitles):
     """
         Uses OpenAI's chat completion API with model 'gpt-4o-mini' to generate an ordered lesson plan with YouTube-searchable keywords.
         Ensures that keywords are unique and cover different aspects of the topic.
         """
     try:
         response = client.chat.completions.create(
             model="gpt-4o-mini",
             messages=[{
                 "role": "user",
                 "content": f"""make 8 mcq questions based on this youtube transcript and return it as a json file: {subtitles}. keep the structure like [{'question', 'answer'}]"""
             }],
             max_tokens=300,
         )
     except Exception as e:
         return {"error": f"Error in GPT-4 call: {str(e)}"}
 
     result = response.choices[0].message.content.strip()
     return result


def interleave_fun_videos(useful_videos, fun_videos, slider_value):
    """
    Interleaves fun videos into useful videos based on the randomness slider value.
    """
    combined_videos = []
    useful_count = 0

    # Define the fun video insertion rate based on slider value
    insertion_rates = {1: 5, 2: 4, 3: 3, 4: 2, 5: 1}
    insert_after = insertion_rates.get(slider_value, 5)  # Default to 1 fun video per 5 study videos

    for video in useful_videos:
        combined_videos.append(video)
        useful_count += 1

        # Insert a fun video after 'insert_after' study videos
        if useful_count % insert_after == 0 and fun_videos:
            combined_videos.append(fun_videos.pop(0))

    # If any fun videos remain, append them at the end
    combined_videos.extend(fun_videos)

    return combined_videos

# @app.route("/quiz", methods=["POST"])
# def process_quiz():
#     data = request.json

#     # Extract parameters
#     youtube_id = data.get("youtubeId")

#     if not youtube_id:
#         return jsonify({"error": "No YouTube ID provided"}), 400
    
#     # Get quiz questions for the provided YouTube video ID
#     subtitles = get_subtitles(youtube_id)

#     quiz = create_quiz(subtitles)

#     return jsonify(quiz)

def get_subtitles(youtube_id):
    url = f"https://www.youtube.com/watch?v={youtube_id}"
    ydl_opts = {
        "skip_download": True,
        "writesubtitles": True,
        "subtitleslangs": ['en'],
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        subtitles = info.get('subtitles', {})
        en_subtitles = subtitles.get('en', [])
        if en_subtitles:
            # Fetch the URL of the English subtitles
            subtitle_url = en_subtitles[0].get('url')
            if subtitle_url:
                # Download the subtitle content
                import requests
                response = requests.get(subtitle_url)
                if response.status_code == 200:
                    return response.text
                else:
                    raise Exception(f"Failed to download subtitles: {response.status_code}")
        raise Exception("No English subtitles found.")

def create_quiz(subtitles):
    """
        Uses OpenAI's chat completion API with model 'gpt-4o-mini' to generate an ordered lesson plan with YouTube-searchable keywords.
        Ensures that keywords are unique and cover different aspects of the topic.
        """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "user",
                "content": f"""make 8 mcq questions based on this youtube transcript and return it as a json file: {subtitles}. keep the structure like [{'question', 'answer'}]"""
            }],
            max_tokens=300,
        )
    except Exception as e:
        return {"error": f"Error in GPT-4 call: {str(e)}"}

    result = response.choices[0].message.content.strip()
    return result


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

    @app.route("/")
    def index():
        return render_template("index.html")
    
    @app.route("/process", methods=["POST"])
    def process():
        data = request.json  # Get JSON data from frontend

        # Extract parameters
        study_topic = data.get("studyTopic")
        duration = data.get("duration", "medium")  # Use "medium" as default
        slider_value = int(data.get("sliderValue", 5))  # Default to highest fun setting
        random_theme = data.get("randomTheme")

        if not study_topic:
            return jsonify({"error": "No study topic provided"}), 400
        if not random_theme:
            return jsonify({"error": "No random theme provided"}), 400
        
        # Extract keywords using GPT-4o-mini
        keywords = get_keywords_from_prompt(study_topic)
        if isinstance(keywords, dict) and "error" in keywords:
            return jsonify(keywords), 500
        
        # Get useful videos from YouTube using the extracted keywords and filter by duration
        useful_videos = get_youtube_videos_for_keywords(keywords, duration=duration)

        # Get fun videos (only Shorts) based on the provided random theme
        fun_videos = get_youtube_fun_videos(random_theme, max_results=len(useful_videos) // 2)  # Get enough fun videos
        
        # Interleave fun videos into the useful videos list
        combined_videos = interleave_fun_videos(useful_videos, fun_videos, slider_value)
        
        return jsonify(combined_videos)
    return app