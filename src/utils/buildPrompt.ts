import { FormValues } from "@/app/generator/components/content-generator-ui";
import {addSection, clean, contentReference, wordContent, formatDescriptions} from "@/utils/helper";

export function buildPrompt(values: FormValues): string {
    const {
        topic,
        purpose,
        audience,
        writingStyle,
        contentLength,
        imageDescriptions,
        negativeConstraints,
        outputLanguage,
        hashtags,
        emoji
    } = values;


    let descriptions = "";


    if(imageDescriptions) {
        // @ts-ignore
        descriptions = formatDescriptions(imageDescriptions);
    }

    let prompt = ` ${outputLanguage === "English" ?
        `
            You are a Content Copywriting Expert with 10+ years of experience in Digital Marketing.  
            You deeply understand target audiences and craft captivating, persuasive, goal-oriented content.
            
            **Special Instructions**
            - Do NOT show your thought process.  
            - Do NOT introduce your persona.  
            - Return ONLY the final content output.
            
            ---
            
            📌 **Inputs**
            - Topic: ${clean(topic)}
            - Purpose: ${clean(purpose)}
            - Audience: ${clean(audience)}
            - Tone/Style: ${writingStyle}
            - Length: ~${wordContent(contentLength)} words  
            ${descriptions && descriptions}
            ${addSection("Hashtags", hashtags)}
            ${addSection("Avoid", negativeConstraints)}
            
            ---
            
            📝 **Output Requirements**
            - **Hook:** Grab attention at the start; include a tagline related to ${topic}.  
            - **Body:** Connect with the input; provide valuable, emotional, or informative content.  
            - **Keywords:** Integrate naturally.  
            - **CTA:** End with a clear, strong call to action.  
            - **Emojis:** ${emoji ? `Use emojis relevant to ${topic}.` : "Do not use any emojis."}  
            - **Hashtags:** Add relevant hashtags related to ${topic}.  
            - **Review:** Ensure correct word count, style consistency, and no negative constraints.
            
            ---
            
            📄 **Output Format**
            - Final content only — no notes, labels, or explanations.  
            - Written in ${outputLanguage} language.  
            - Pleasant, clear, natural tone (not overly technical).  
            - Output should be complete, effective, and easy to read.
            
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
          - Topic: ${clean(topic)}
          - Purpose: ${clean(purpose)}
          - Audience: ${clean(audience)}
          - Tone: ${writingStyle}
          - Reference: ${contentReference(purpose)}
          - Length: ~${wordContent(contentLength)} words  
          ${descriptions && descriptions}
          ${addSection("Hashtags", hashtags)}
          ${addSection("Avoid", negativeConstraints)}
    
          ---
    
          📘 **AI Rule**
          Reference ကို tone/flow အတွက်သာ အသုံးပြုပါ။ မိတ္တူမကူးပါနှင့်။  
          Target Audience နှင့် Purpose ကို တိကျစွာ ထိန်းသိမ်းပါ။
    
          ---
    
          📝 **Output Requirements**
          1. **Hook** – စာဖတ်သူကို စတင်ချင်းဆွဲဆောင်ပါ။ စာဖတ်သူစိတ်ဝင်စားစေမယ့် ${topic} နဲ့ သက်ဆိုင်တဲ့ Tagline ကိုလည်း content အစမှာ ထည့်ပေးပါ။
          2. **Body** – Reference အပေါ်အခြေခံပြီး သစ်လွင်သော idea, tone, flow ဖြင့် ရေးပါ။  
          3. **Keywords** – သဘာဝကျကျ ထည့်ပါ။  
          4. **CTA** – ပြတ်သားပြီး စိတ်လှုပ်ရှားစေမယ့် CTA နဲ့ အဆုံးသတ်ပါ။
          5. **Emojis** – ${emoji ? `${topic} နဲ့ သက်ဆိုင်တဲ့ Emojis အသုံးပြုပါ။` : 'Emojis မသုံးပါ။'}  
          6. **Hashtags** – ${topic} နဲ့ သက်ဆိုင်တဲ့ Hashtags ထည့်ပါ။  
          7. **Format** –  
             - Final content only (no notes or labels)  
             - Written in Myanmar language  
             - content ကို မြန်မာလို ရေးရင် content, marketing, SEO စတဲ့ Loanwords (Borrowed words) English words တွေကို သဘာဝကျစွာ English အဖြစ် အသုံးပြုပါ။ 
            Phonetic Translation (ဥပမာ - “content” ကို “ကွန်းတန့်” လိုမျိုး) လုံးဝ မပြုလုပ်ပါနှင့်။
`
    }`

    return prompt;
}



