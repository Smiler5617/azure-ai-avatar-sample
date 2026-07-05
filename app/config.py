import os

# -----------------------------
# STT用 Speech Service
# -----------------------------
STT_SPEECH_KEY = os.getenv("STT_SPEECH_KEY")
STT_SPEECH_REGION = os.getenv("STT_SPEECH_REGION")

# -----------------------------
# Avatar(TTS)用 Speech Service
# -----------------------------
TTS_SPEECH_KEY = os.getenv("TTS_SPEECH_KEY")
TTS_SPEECH_REGION = os.getenv("TTS_SPEECH_REGION")

# -----------------------------
# LLM API
# -----------------------------
LLM_API_URL = os.getenv("LLM_API_URL")