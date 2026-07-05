// ============================================
// stt.js
// Speech To Text
// ============================================
let recognizer = null;
let sttToken = null;
let sttRegion = null;



//*************************************
// STTトークン取得
//*************************************
async function getSTTToken(){

    if(sttToken && sttRegion){
        return;
    }

    const response = await fetch("/api/stt-token");
    if(!response.ok){
        throw new Error("STT Token取得失敗");
    }

    const sttTokenData = await response.json();
    sttToken = sttTokenData.token;
    sttRegion = sttTokenData.region;
    console.log("stt-tokenの取得完了");
    console.log("sttTokenData =", sttTokenData);
}


//*************************************
// STT開始
//*************************************
async function startRecognition(callback){

    //----------------------------------
    // Token取得
    //----------------------------------
    await getSTTToken();


    //----------------------------------
    // STT 処理
    //----------------------------------

    // STT のインスタンス作成
    console.log("STT のインスタンス作成開始");
    const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(sttToken, sttRegion);    // Token方式
    console.log("Token方式 設定完了");
    speechConfig.speechRecognitionLanguage = "ja-JP";    // 言語設定
    console.log("言語 設定完了");  
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();    // マイク入力
    console.log("マイク入力 ON");
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);    // 音声認識エンジンのインスタンスを作成

    // 発話内容の解析中処理
    recognizer.recognizing = (s, e) => {
        document.getElementById("status").innerText = "認識中";
        document.getElementById("realtime").innerText = e.result.text;
    };


    //----------------------------------
    // 認識完了後の処理　LLMに投げた結果を
    //----------------------------------

    // 発話内容の解析完了後の処理
    recognizer.recognized = async (s, e) => {

        if (e.result.reason !== SpeechSDK.ResultReason.RecognizedSpeech) {
            return;
        }

        const userText = e.result.text;
        
        if (callback) {
            await callback(userText);
        }
    };

    recognizer.canceled = (s, e) => {
        console.error(e);
        document.getElementById("status").innerText = "認識エラー";
    };


    //----------------------------------
    // STT開始
    //----------------------------------
    recognizer.startContinuousRecognitionAsync();
}


//*************************************
// STT停止
//*************************************
async function stopRecognition(){

    if(!recognizer){
        return;
    }

    recognizer.stopContinuousRecognitionAsync();

    recognizer.close();

    recognizer = null;

}