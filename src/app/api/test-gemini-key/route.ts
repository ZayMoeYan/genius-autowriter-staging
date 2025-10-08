import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { apiKey } = await req.json();

        if (!apiKey) {
            return NextResponse.json({ valid: false, error: "API key required" }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            await model.generateContent("hi");

            return NextResponse.json({ valid: true });
        } catch (err: any) {
            return NextResponse.json({
                valid: false,
                error: err.message || "Invalid API key",
            });
        }

    } catch (err) {
        return NextResponse.json({ valid: false, error: "Request error" }, { status: 400 });
    }
}
