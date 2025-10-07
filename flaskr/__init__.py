from flask import Flask
from flask_cors import CORS

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
    CORS(app, origins=["http://localhost:4173"])  # Allow requests from your frontend

    # Register routes
    from .routes import bp
    app.register_blueprint(bp)

    return app