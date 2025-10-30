import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            title,
            topic,
            purpose,
            audience,
            writingStyle,
            outputLanguage,
            contentLength,
            imageDescriptions,
            negativeConstraints,
            hashtags,
            emoji,
            apikey,
        } = body;

        // Step 1: Build the dynamic prompt
        const prompt = `
      Write a ${writingStyle} piece titled "${title}" about "${topic}".
      Purpose: ${purpose}.
      Target Audience: ${audience}.
      Output Language: ${outputLanguage}.
      Content Length: ${contentLength}.
      Include hashtags: ${hashtags || "none"}.
      Include emoji: ${emoji ? "yes" : "no"}.
      Avoid: ${negativeConstraints || "none"}.
      Include image ideas/descriptions: ${imageDescriptions?.join(", ") || "none"}.
    `.trim();

        const res = await axios.post(`${process.env["NEXT_PUBLIC_BASE_URL"]}/contents/api/generate`, {
            prompt,
            images: imageDescriptions,
            apikey,
        });

        const result = res.data;

        return NextResponse.json(
            { success: true, result },
            { headers: { "Access-Control-Allow-Origin": "*" } }
        );
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            error.message ||
            "An unknown error occurred while generating content.";

        return NextResponse.json(
            { success: false, error: message },
            { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
        );
    }
}
