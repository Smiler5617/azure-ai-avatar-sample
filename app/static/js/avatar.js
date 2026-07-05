//=========================================================
// avatar.js
//=========================================================
let avatarSynthesizer = null;
let peerConnection = null;

let ttsToken = null;
let ttsRegion = null;


//=====================================
// TTS Token取得
//=====================================
async function getTTSToken() {

    if (ttsToken && ttsRegion) {
        return;
    }

    const response = await fetch("/api/tts-token");
    if (!response.ok) {
        throw new Error("TTS Token取得失敗");
    }

    const ttsTokenData = await response.json();
    ttsToken = ttsTokenData.token;
    ttsRegion = ttsTokenData.region;
    console.log("tts-tokenの取得完了");
    console.log("ttsTokenData =", ttsTokenData);
}


//=====================================
// Avatar起動
//=====================================
async function startAvatar() {

    //---------------------------------
    // Token取得
    //---------------------------------
    await getTTSToken();


    //---------------------------------------    
    // Avatarの設定 & 認証情報の取得
    //---------------------------------------

    // Avatarの設定
    const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(ttsToken, ttsRegion);
    speechConfig.speechSynthesisVoiceName = "ja-JP-NanamiNeural";    // Voice設定
    const avatarConfig =new SpeechSDK.AvatarConfig("lisa", "casual-sitting");    // Avatar設定
    avatarSynthesizer = new SpeechSDK.AvatarSynthesizer(speechConfig, avatarConfig);
    console.log("Avatar設定の完了");

    // TURNサーバーに接続するための一時的な認証情報を取得   !!! 追加・変更処理部分
    const relayResponse = await fetch("api/avatar-relay-token");
    if (!relayResponse.ok) {
        throw new Error("Relay Token取得失敗");
    }    
    const relayToken = await relayResponse.json();
    console.log("avatar-tokenの取得完了");
    console.log("relayToken =", relayToken);


    //---------------------------------------    
    // PeerConnection生成（WebRTCで通信するための「通信回線」を作る）
    //---------------------------------------

    // WebRTC用の通信回線を作成
    peerConnection = new RTCPeerConnection({
            iceServers: [{
                urls: relayToken.Urls,  // Array.isArray(relayToken.Urls) ? relayToken.Urls: [relayToken.Urls],
                username: relayToken.Username,
                credential: relayToken.Password
            }]
        });
    console.log("WebRTC接続の完了")

    // 映像(video) と 音声(audio) を受信するために、接続先の相手に受信する情報を伝える
    peerConnection.addTransceiver("video", { direction: "recvonly" });
    peerConnection.addTransceiver("audio", { direction: "recvonly" });

    // 相手（今回は Azure Avatar）から映像や音声が届いたときの処理　⇒ videoタグへ連携
    peerConnection.ontrack = function (event) {
        document.getElementById("avatarVideo").srcObject = event.streams[0];
    };
    console.log("Video受信の準備完了")

    //---------------------------------------    
    // WebRTC用の通信回線に接続してAvatar開始
    //---------------------------------------    
    await avatarSynthesizer.startAvatarAsync(peerConnection)
    console.log("Avatar started")
}


//=====================================
// Avatar発話
//=====================================
async function speakAvatar(text) {

    if (!avatarSynthesizer) {
        return;
    }

    if (!text) {
        return;
    }

    await avatarSynthesizer.speakTextAsync(text);
}


//=====================================
// Avatar停止
//=====================================
async function stopAvatar() {

    if (avatarSynthesizer) {
        await avatarSynthesizer.stopAvatarAsync();
        avatarSynthesizer.close();
        avatarSynthesizer = null;

    }

    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;

    }

    document.getElementById("avatarVideo").srcObject = null;
}