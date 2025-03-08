import openai
from openai import OpenAI

import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
from youtube_search import YoutubeSearch
import os

OPENAI_API_KEY = "<something>"
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")

scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]


def get_youtube_videos_for_keywords(max_results=5):
    """
    Searches the YouTube API for videos matching each keyword.
    Returns a list of video dictionaries with title, URL, and is_fun flag.
    """

    VideosSearch = YoutubeSearch("NoCopyrightSounds", max_results=10).to_json()
    print(VideosSearch)

get_youtube_videos_for_keywords()