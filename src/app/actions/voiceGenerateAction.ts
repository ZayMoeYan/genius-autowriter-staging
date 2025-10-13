import {GoogleGenerativeAI} from "@google/generative-ai";
import {FormValues} from "@/app/generator/components/content-generator-ui";
import getApikey from "@/app/actions/getApikey";

function parseBase64DataUrl(dataUrl: any) {
    const [header, base64] = dataUrl.split(",");
    const mimeType = header.match(/:(.*?);/)[1];
    return { mimeType, data: base64 };
}

export const sendToGemini = async (base64Images: any, base64Audio: any, values: FormValues) => {
    const apikey = await getApikey();
    // @ts-ignore
    const genAI = new GoogleGenerativeAI(apikey);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
    });

    const prompt = `
        You are an expert Facebook content writer and copywriter with over 10 years of experience creating highly engaging, persuasive, and emotionally appealing social media posts.
        
        Your task:
        - Write Facebook posts **entirely in Myanmar (Burmese)** language.
        - Make the writing sound natural, friendly, and relevant to Myanmar readers.
        - Focus on storytelling, emotion, and connection — not just information.
        - Use short, catchy sentences and creative expressions suited for Facebook audiences.
        - Content Words count must be between 300 and 400.
         -Emojis - ${values.emoji ? `Use the relevant emojis to the content.` : "Don't use the emojis at all in entire content. "}  
        - Always make the content suitable for Facebook — conversational, modern, and easy to read.
        - Avoid overly formal tone unless the topic requires it (e.g., corporate content).
        - Add a simple call-to-action (CTA) where appropriate (e.g., “Comment below!”, “Try it today!”, “Share with your friends!”).
        
        Instructions:
        The user will provide images or an audio message (in Burmese or English).
        You will:
        1. Understand the context or message.
        2. Generate a complete Facebook post in **Myanmar (Burmese)** that matches the user's intent (e.g., product promotion, event announcement, motivation, storytelling, etc.).
        3. Ensure every output sounds engaging and authentic to Myanmar social media culture.
        
        Always respond **only in Myanmar language**, in a creative, persuasive, and human-like tone that resonates with Myanmar people.
    `;


    try {
        const parts = base64Images.map((url: any) => {
            const { mimeType, data } = parseBase64DataUrl(url);
            return { inlineData: { mimeType, data } };
        });

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        ...parts,
                        {
                            inlineData: {
                                mimeType: "audio/wav",
                                data: base64Audio,
                            },
                        },
                    ],
                },
            ],
        });

        return result.response.text?.();

    } catch (err) {
        console.error("Gemini error:", err);
    }
};