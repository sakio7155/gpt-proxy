require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/gpt", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "プロンプトがありません" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    res.json({ result: data.choices?.[0]?.message?.content || "⚠️ GPTから結果が得られませんでした" });
  } catch (err) {
    res.status(500).json({ error: "サーバーエラー", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ GPTプロキシAPIが http://localhost:${PORT} で稼働中`);
});
