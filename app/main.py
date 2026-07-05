# app.py
import os
import requests
from flask import Flask, jsonify, render_template, request    # requestを追加

# config.py の読み込み
from config import *


app = Flask(__name__, static_folder="static", template_folder="templates")


# =========================
# index.html を返す
# =========================
@app.route("/")
def index():
    return render_template("index.html", llm_api_url=LLM_API_URL)


# =========================
# Speech Token 発行　※ STT用（japanリージョン)
# =========================
@app.route("/api/stt-token")
def get_stt_token():

    url = f"https://{STT_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken"

    headers = {
        "Ocp-Apim-Subscription-Key": STT_SPEECH_KEY
    }

    response = requests.post(url, headers=headers)
    print(response.text)

    return jsonify({
        "token": response.text,
        "region": STT_SPEECH_REGION
    })


# =========================
# Speech Token 発行　※ TTS用（Avatarサービスが使える リージョン)
# =========================
@app.route("/api/tts-token")
def get_tts_token():

    url = f"https://{TTS_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken"

    headers = {
        "Ocp-Apim-Subscription-Key": TTS_SPEECH_KEY
    }

    response = requests.post(url, headers=headers)

    return jsonify({
        "token": response.text,
        "region": TTS_SPEECH_REGION
    })


# =========================
# TURNサーバー接続情報取得
# =========================
@app.route("/api/avatar-relay-token")
def get_avatar_token():

    url = f"https://{TTS_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1"

    headers = {
        "Ocp-Apim-Subscription-Key": TTS_SPEECH_KEY
    }

    response = requests.get(url, headers=headers)

    return jsonify(response.json())



if __name__ == "__main__":
    app.run(debug=True)