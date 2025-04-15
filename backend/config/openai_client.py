import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get API key from environment
api_key = os.getenv("OPENAI_API_KEY1")
client = OpenAI(api_key=api_key)