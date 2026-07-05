//=========================================================
// llm.js
// LLM問い合わせ
//=========================================================


//=====================================
// LLMへ問い合わせ
//=====================================
async function askLLM(message) {

    const response = await fetch(
        LLM_API_URL,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        }
    );

    if (!response.ok) {
        throw new Error("LLM呼び出し失敗");
    }

    const data = await response.json();

    return data.answer;
}