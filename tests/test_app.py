import openai


def get_keywords_from_prompt(prompt):
    """
    Uses OpenAI's chat completion API with model 'gpt-4o-mini' to extract keywords from the prompt.
    """
    try:
        response = openai.chatCompletion.create(
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

def test_get_keywords_from_prompt():
    prompt = "What are the key technologies in 2025?"
    expected_keywords = ["key", "technologies", "2025"]
    print(get_keywords_from_prompt(prompt))

def test_get_keywords_from_prompt_empty():
    prompt = ""
    expected_keywords = []
    print(get_keywords_from_prompt(prompt))

def test_get_keywords_from_prompt_special_characters():
    prompt = "Hello, world! @2025 #technology"
    expected_keywords = ["Hello", "world", "2025", "technology"]
    print(get_keywords_from_prompt(prompt))

def test_get_keywords_from_prompt_numbers():
    prompt = "Top 10 technologies in 2025"
    expected_keywords = ["Top", "10", "technologies", "2025"]
    print(get_keywords_from_prompt(prompt))

test_get_keywords_from_prompt()
test_get_keywords_from_prompt_empty()
test_get_keywords_from_prompt_special_characters()
test_get_keywords_from_prompt_numbers()