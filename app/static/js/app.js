// ============================================
// app.js
// アプリ全体の制御
// ============================================


//*************************************
// 会話開始
//*************************************
document.getElementById("start").addEventListener("click", async () => {

    try {
        document.getElementById("status").innerText = "Avatar起動中";

        // Avatar起動
        await startAvatar();

        // ② STT開始
        await startRecognition(async (text) => {

            document.getElementById("status").innerText = "AI応答中";

            // LLMへ問い合わせ
            const answer = await askLLM(text);

            // 回答表示
            document.getElementById("answer").innerText = answer;

            // Avatar発話
            await speakAvatar(answer);
            document.getElementById("status").innerText = "待機中";
        });
    }
    catch(err){
        console.error(err);
        document.getElementById("status").innerText = "初期化失敗";
    }
});



//*************************************
// 会話終了
//*************************************
document.getElementById("stop").addEventListener("click", async () => {
    await stopRecognition();
    await stopAvatar();
    document.getElementById("status").innerText = "停止中";
});