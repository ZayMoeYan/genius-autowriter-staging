import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {cookies} from "next/headers";
import jwt from "jsonwebtoken";


export const runtime = "edge";

export async function POST(req: NextRequest) {
    try {
        const { email, password, geminiApiKey } = await req.json();

        if (!email || !password || !geminiApiKey) {
            return NextResponse.json(
                { success: false, message: "Missing email, password, or Gemini API key." },
                { status: 400 }
            );
        }

        const res = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + 'auth/login', {
            email,
            password,
            geminiApiKey,
        });

        const { access_token, role } = res.data;

        if (!access_token) {
            throw new Error("JWT token not returned from backend.");
        }

        const cookieStore = await cookies();
        cookieStore.set('access-token', access_token, { httpOnly: true, secure: true});
        cookieStore.set('role-token', jwt.sign(role, process.env.NEXT_SECRET_KEY!), { httpOnly: true, secure: true})

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
