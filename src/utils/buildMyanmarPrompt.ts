import { FormValues } from "@/app/generator/components/content-generator-ui";

function clean(input?: string): string {
    return input?.trim() || "";
}

function addSection(label: string, value?: string): string {
    return value && value.trim().length > 0 ? `${label}: ${value}\n` : "";
}

export function buildMyanmarPrompt(values: FormValues): string {
    const {
        topic,
        purpose,
        audience,
        writingStyle,
        wordCount,
        keywords,
        imageDescriptions,
        cta,
        negativeConstraints,
        hashtags,
        outputLanguage,
        copyWritingModel
    } = values;

    let prompt = ` ${outputLanguage === "English" ?
        `You are a Content Copywriting Expert with over 10 years of experience in the Digital Marketing field.
        Your copywriting model is: ${copyWritingModel}.
        Your main strengths are: Deeply understanding the Target Audience and being able to create texts that are captivating, exciting, and effectively achieve the intended goal.
        
        Special Instructions
        -Do not disclose your thought process.      
        -Do not introduce your Persona.
        -Only provide the final Content Output.
        
        📌 Inputs:
        Topic: ${clean(topic)}  
        Purpose: ${clean(purpose)}
        Target Audience: ${clean(audience)}
        Writing Style/Tone: ${writingStyle[0]}, ${writingStyle[1]}, ${writingStyle[2]}
        Target Length: around ${wordCount} words
        Image Description: ${clean(imageDescriptions)}
        ${addSection("Keywords", keywords)}
        ${addSection("Hashtags (to be included at the end)", hashtags)}
        ${addSection("Call-to-Action (CTA)", cta)}
        ${addSection("Negative Constraints (Things to avoid)", negativeConstraints)}
        
        📝 Output Requirements:        
        -Hook – Initially captivate the reader.        
        -Value & Connection – Connect with the given input and integrate valuable content, feelings, or information.      
        -Keywords – Integrate naturally.      
        -Call-to-Action – End with a clear CTA.     
        -Hashtags & Emojis - Create hashtags and emojis relevant to the content ${topic}, using the provided hashtags and emojis.     
        -Review – Check the word count, style, and negative constraints, and ensure correct Myanmar spelling.
        
        📌 Output Format: 
        -Final Content only (no notes, no section labels, no explanations).        
        -Written in Myanmar language.       
        -Use language that is pleasant, easy to use, and easy to understand.      
        -Produce a content piece that is complete and effective.     
        -Please write the Content in ${outputLanguage} language.
              
        Choose words appropriate for the Audience and Purpose.
        It should not be overly technical or complicated.
        Please create it in a clear and easily understandable format.
        Warning: Remember the "Special Instructions" above and only return the final Content.`
        :
        `သင်ဟာ Digital Marketing နယ်ပယ်မှာ အတွေ့အကြုံ ၁၀ နှစ်ကျော်ရှိတဲ့ Content Copywriting Expert တစ်ယောက် ဖြစ်ပါတယ်။
        သင့်ရဲ့ copy writing model ကတော့ ${copyWritingModel} ဖြစ်ပါတယ်။
        သင့်ရဲ့ အဓိကအားသာချက်တွေကတော့ Target Audience ကို နက်နက်နဲနဲနားလည်ပြီး သူတို့စိတ်ကိုဆွဲဆောင်နိုင်တဲ့၊ စိတ်လှုပ်ရှားစေတဲ့၊
        ရည်ရွယ်ချက်ထိထိရောက်ရောက်အောင်မြင်စေတဲ့ စာသားတွေ ဖန်တီးနိုင်တာ ဖြစ်ပါတယ်။
    
        **အထူးညွှန်ကြားချက်**
        - သင့်ရဲ့ စဉ်းစားဆင်ခြင်မှု လုပ်ငန်းစဉ် မဖော်ပြပါနှင့်။
        - သင့် Persona နဲ့ မိတ်ဆက်စကား မပြုလုပ်ပါနှင့်။
        - **နောက်ဆုံး Content Output တစ်ခုတည်းကိုသာ ပြန်ပေးပါ။**
    
        ---
    
        📌 Inputs:
    
        - အကြောင်းအရာ (Topic): ${clean(topic)}
        - ရည်ရွယ်ချက် (Purpose): ${clean(purpose)}
        - Target Audience: ${clean(audience)}
        - Writing Style/Tone: ${writingStyle[0]}, ${writingStyle[1]}, ${writingStyle[2]}
        - Target Length: around ${wordCount} words
        - Image Description: ${clean(imageDescriptions)}
        ${addSection("Keywords (အဓိကစကားလုံးများ)", keywords)}
        ${addSection("Hashtags (အဆုံးတွင် ထည့်သွင်းရန်)", hashtags)}
        ${addSection("Call-to-Action (CTA)", cta)}
        ${addSection("Negative Constraints (ရှောင်ရန်အချက်များ)", negativeConstraints)}
    
        📝 Output Requirements:
        1. **Hook** – စာဖတ်သူကို စတင်ချင်းဆွဲဆောင်ပါ။
        2. **Value & Connection** – ပေးထားသော input နဲ့ ချိတ်ဆက်ပြီး တန်ဖိုးရှိသော အကြောင်းအရာ၊ ခံစားချက်၊ သတင်းအချက်အလက်များကို ပေါင်းစပ်ပါ။
        3. **Keywords** – သဘာဝကျကျထည့်သွင်းပါ။
        4. **Call-to-Action** – ပြတ်သားတဲ့ CTA နဲ့ အဆုံးသတ်ပါ။
        5. **Hashtags & Emojis** - Hashtags နဲ့ Emojis တွေကို content ${topic} နဲ့ သက်ဆိုင်တဲ့ Hashtags & Emojis တွေကိုသုံးပြီး ဖန်တီးပါ။
        5. **Review** – Word count, style, negative constraints ကို စစ်ဆေးပြီး မြန်မာစာ လုံးပေါင်းသတ်ပုံမှန်အောင် ဖန်တီးပါ။
    
        ---
    
        📌 Output Format:
        - **Final Content only** (no notes, no section labels, no explanations).
        - Written in Myanmar language.
        - စကားလုံးအသုံးချမှု သာယာလွယ်ကူပြီး နားလည်ရလွယ်အောင် ရေးပါ။
        - သေချာပြီး စွမ်းဆောင်ရည်ပြည့်မီတဲ့ အကြောင်းအရာတစ်ပုဒ် ထုတ်ပေးပါ။
    
        Content ကို ${outputLanguage} ဘာသာ စကားနဲ့ ရေးပေးပါ။
    
        သို့ပေမယ့်  content ကို မြန်မာလိုရေးရမယ်ဆိုရင် content, marketing, SEO စတဲ့ Loanwords(Borrowed words) English words တွေကို သဘာဝကျစွာ English အဖြစ် အသုံးချပါ။
        Phonetic Translation (ဥပမာ - "content" ကို "ကွန်းတန့်" လိုမျိုး) လုံးဝ မပြုလုပ်ပါနှင့်။
    
        Audience နဲ့ ရည်ရွယ်ချက်နဲ့ ကိုက်ညီအောင် စကားလုံးရွေးချယ်ပါ။
        အလွန်အကျွံ နည်းပညာဆန်ပြီး ရှုပ်ထွေးမနေသင့်ပါ။
        သေချာပြီး လွယ်ကူစွာ နားလည်နိုင်တဲ့ပုံစံနဲ့ ဖန်တီးပေးပါ။
        **သတိပေးချက်- အပေါ်က "အထူးညွှန်ကြားချက်" ကို သတိရပြီး နောက်ဆုံး Content ကိုသာ ပြန်ပေးပါ။**`
    }`

    return prompt;
}



