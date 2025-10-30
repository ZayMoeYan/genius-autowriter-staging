import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {login} from "@/app/actions/loginAction";


export async function POST(req: NextRequest) {
    try {
        const { email, password, geminiApiKey } = await req.json();

        if (!email || !password || !geminiApiKey) {
            return NextResponse.json(
                { success: false, message: "Missing email, password, or Gemini API key." },
                { status: 400 }
            );
        }

       const data =  await login(email, password, geminiApiKey)

        const { access_token } = data;

        if (!access_token) {
            throw new Error("JWT token not returned from backend.");
        }

        return NextResponse.json(
            { success: true, access_token, message: "Login successful." },
            { status: 200 }
        );
    } catch (error: any) {
        const msg =
            error.response?.data?.message || error.message || "Login failed.";
        return NextResponse.json({ success: false, message: msg }, { status: 401 });
    }
}
