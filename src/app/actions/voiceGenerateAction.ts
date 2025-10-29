import {GoogleGenerativeAI} from "@google/generative-ai";
import {FormValues} from "@/app/generator/components/content-generator-ui";
import getApikey from "@/app/actions/getApikey";
import {FromVoiceValues} from "@/app/generator/voice/components/VoiceChatDemo";
import {clean, contentReference, formatDescriptions, wordContent} from "@/utils/helper";

function parseBase64DataUrl(dataUrl: any) {
    const [header, base64] = dataUrl.split(",");
    const mimeType = header.match(/:(.*?);/)[1];
    return { mimeType, data: base64 };
}

export const sendToGemini = async (base64Images: any, base64Audio: any, values: FromVoiceValues) => {
    const apikey = await getApikey();
    // @ts-ignore
    const genAI = new GoogleGenerativeAI(apikey);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
    });


    let descriptions = "";


    if(values.imageDescriptions) {
        // @ts-ignore
        descriptions = formatDescriptions(values.imageDescriptions);
    }

    let prompt = ` ${values.outputLanguage === "English" ?
        `
	You are a Content Copywriting Expert with 10+ years of experience in Digital Marketing.  
	You have a deep understanding of target audiences and the ability to craft captivating, persuasive, and goal-driven content.

	**Special Instructions**
	- Do NOT show your thought process.  
	- Do NOT introduce your persona.  
	- Return ONLY the final content output.

	---

	📌 **Inputs**
	- Purpose: ${clean(values.purpose)}
	- Reference: ${contentReference(values.purpose)}
	- Length: ~${wordContent(values.contentLength)} words  
	${descriptions && descriptions}

	---

	📘 **AI Rule**
	Use the reference only for tone and flow guidance — do **not** copy directly.  
	Stay accurate to the given **Purpose** and **Target Audience**.

	---

	📝 **Output Requirements**
	1. **Hook** – Start with a tagline related to the topic to immediately capture attention.  
	2. **Body** – Use the reference as inspiration, but write with fresh ideas, unique tone, and natural flow.  
	3. **Keywords** – Integrate keywords naturally within the content.  
	4. **CTA** – End with a clear, strong, and engaging call to action.  
	5. **Emojis** – ${values.emoji ? `Use emojis relevant to the topic.` : "Do NOT use emojis."}  
	6. **Hashtags** – Add relevant hashtags related to the topic.  
	7. **Format** –  
	   - Final content only (no labels, no notes, no explanations).  
	   - Written in ${values.outputLanguage} language.  
	   - Use a natural, easy-to-read tone (avoid overly technical wording).  
	   - Include English marketing terms like “content”, “marketing”, “SEO” where appropriate — do **not** use phonetic translations.  

	---

	⚠️ Follow the “Special Instructions” strictly and return only the final content.
`
        :

        `
          သင်သည် Digital Marketing တွင် အတွေ့အကြုံ ၁၀ နှစ်ကျော်ရှိသော Content Copywriting Expert ဖြစ်ပါသည်။  
          Target Audience ကို နက်နက်နဲနဲနားလည်ပြီး စိတ်ကို ဆွဲဆောင်နိုင်သော စာသားများ ဖန်တီးနိုင်သည်။
    
          **စည်းကမ်း**
          - စဉ်းစားမှုလုပ်ငန်းစဉ် မဖော်ပြပါနှင့်။  
          - Persona မဖော်ပြပါနှင့်။  
          - နောက်ဆုံး Output တစ်ခုတည်းသာ ပြန်ပေးပါ။
    
          ---
    
          📌 **Inputs**
          - Purpose: ${clean(values.purpose)}
          - Reference: ${contentReference(values.purpose)}
          - Length: ~${wordContent(values.contentLength)} words  
          ${descriptions && descriptions}
          
          (🔊 Topic ကို အသံဖိုင်အနေနဲ့ ထည့်ထားပါမည်။)
    
          ---
    
          📘 **AI Rule**
          Reference ကို tone/flow အတွက်သာ အသုံးပြုပါ။ မိတ္တူမကူးပါနှင့်။  
          Target Audience နှင့် Purpose ကို တိကျစွာ ထိန်းသိမ်းပါ။
    
          ---
    
          📝 **Output Requirements**
          1. **Hook** – စာဖတ်သူကို စတင်ချင်းဆွဲဆောင်ပါ။ စာဖတ်သူစိတ်ဝင်စားစေမယ့် အသံဖိုင်အတွင်းရှိ topic နဲ့ သက်ဆိုင်တဲ့ Tagline ကိုလည်း content အစမှာ ထည့်ပေးပါ။
          2. **Body** – Reference အပေါ်အခြေခံပြီး သစ်လွင်သော idea, tone, flow ဖြင့် ရေးပါ။  
          3. **Keywords** – သဘာဝကျကျ ထည့်ပါ။  
          4. **CTA** – ပြတ်သားပြီး စိတ်လှုပ်ရှားစေမယ့် CTA နဲ့ အဆုံးသတ်ပါ။
          5. **Emojis** – ${values.emoji ? `topic နဲ့ သက်ဆိုင်တဲ့ Emojis အသုံးပြုပါ။` : 'Emojis မသုံးပါ။'}  
          6. **Hashtags** – topic နဲ့ သက်ဆိုင်တဲ့ Hashtags ထည့်ပါ။  
          7. **Format** –  
             - Final content only (no notes or labels)  
             - Written in Myanmar language  
             - content ကို မြန်မာလို ရေးရင် content, marketing, SEO စတဲ့ Loanwords (Borrowed words) English words တွေကို သဘာဝကျစွာ English အဖြစ် အသုံးပြုပါ။ 
            Phonetic Translation (ဥပမာ - “content” ကို “ကွန်းတန့်” လိုမျိုး) လုံးဝ မပြုလုပ်ပါနှင့်။
`
    }`


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
                                mimeType: "audio/webm",
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