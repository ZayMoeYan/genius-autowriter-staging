import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export const config = {
    api: { bodyParser: false },
};

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("audio") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No audio file uploaded" }, { status: 400 });
        }

        // Save temporarily (optional)
        const buffer = Buffer.from(await file.arrayBuffer());
        const tempPath = path.join("/tmp", file.name);
        await fs.writeFile(tempPath, buffer);

        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        if (!GROQ_API_KEY) {
            return NextResponse.json({ error: "GROQ_API_KEY not set" }, { status: 500 });
        }

        const sttForm = new FormData();
        sttForm.append("file", new Blob([buffer]), file.name);
        sttForm.append("model", "whisper-large-v3");
        sttForm.append("language", "my");
        sttForm.append("temperature", "0");
        sttForm.append("prompt", "ဤဖိုင်တွင် မြန်မာဘာသာစကားဖြင့် စကားပြောထားသည်။");
        sttForm.append("response_format", "verbose_json");

        const sttResp = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
            body: sttForm,
        });

        if (!sttResp.ok) {
            const errText = await sttResp.text();
            return NextResponse.json({ error: "Groq STT error: " + errText }, { status: 500 });
        }

        const sttJson = await sttResp.json();
        const sttText = sttJson.text || "";
        console.log("Transcription:", sttText);


        const prompt = `
သုံးစွဲသူ၏ ပြောဆိုချက် = "${sttText}" ကို မြန်မာလို မှန်မှန်ကန်ကန် ပြန်ရေးပေးပါ
`;

        const aiResp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
            }),
        });


        const aiJson = await aiResp.json();
        const aiText = aiJson?.choices?.[0]?.message?.content || "";

        return NextResponse.json({ stt: sttText, responseText: aiText });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
