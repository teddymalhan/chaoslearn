import openai
from openai import OpenAI

import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import os

OPENAI_API_KEY = "<something>"
YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")

scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]


def get_youtube_videos_for_keywords(max_results=5):
    """
    Searches the YouTube API for videos matching each keyword.
    Returns a list of video dictionaries with title, URL, and is_fun flag.
    """

    # Disable OAuthlib's HTTPS verification when running locally.
    # *DO NOT* leave this option enabled in production.
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"
    client_secrets_file = "client_secret_405931529153-vj8ekninjpamiigagngqvgbvmv4r0v5p.apps.googleusercontent.com.json"

    # Get credentials and create an API client
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        client_secrets_file, scopes)
    flow.redirect_uri = "http://localhost/"
    credentials = flow.run_local_server(port=0)
    auth_url, __ = flow.authorization_url(prompt="consent")
    print('Please go to this URL: {}'.format(auth_url))
    code = input('Enter the authorization code: ')
    flow.fetch_token(code=code)
    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, credentials=credentials)

    request = youtube.search().list(
        part="snippet",
        maxResults=25,
        q="surfing"
    )
    response = request.execute()

    print(response)

get_youtube_videos_for_keywords()