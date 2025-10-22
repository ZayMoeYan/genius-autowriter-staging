'use server';

import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

export async function login(username: string, password: string, apikey: string) {
    try {
        const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + 'auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                username: username,
                password: password,
            }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return {
                ok: false,
                status: res.status,
                message: errorData.detail || "Unknown error",
            };
        }

        const data = await res.json();

        let userRole = "";
        let name = "";
        let userEmail = "";
        let userExpiredAt = "";
        let userGeneratedCount = "";
        let apikeyToken = "";
        let idToken = "";

        if(data.role === "ADMIN") {
            userRole = jwt.sign(data.role, process.env.NEXT_SECRET_KEY!);
            name = jwt.sign(data.username, process.env.NEXT_SECRET_KEY!);
            userEmail = jwt.sign(data.email, process.env.NEXT_SECRET_KEY!);
        }else {
            userRole = jwt.sign(data.role, process.env.NEXT_SECRET_KEY!);
            name = jwt.sign(data.username, process.env.NEXT_SECRET_KEY!);
            userEmail = jwt.sign(data.email, process.env.NEXT_SECRET_KEY!);
            userExpiredAt = jwt.sign(data.trial_expires_at, process.env.NEXT_SECRET_KEY!);
             userGeneratedCount = jwt.sign(data.generated_count, process.env.NEXT_SECRET_KEY!);
             idToken = jwt.sign(data.id, process.env.NEXT_SECRET_KEY!);
             apikeyToken = jwt.sign(apikey, process.env.NEXT_SECRET_KEY!);
        }



        if(data.access_token) {
            const cookieStore = await cookies();
            cookieStore.set('access-token', data.access_token, { httpOnly: true, secure: true});
            cookieStore.set('apikey-token', apikeyToken, { httpOnly: true, secure: true});
            cookieStore.set('role-token', userRole, { httpOnly: true, secure: true})
            cookieStore.set('username-token', name, { httpOnly: true, secure: true})
            cookieStore.set('email-token', userEmail, { httpOnly: true, secure: true})
            cookieStore.set('expiredAt-token', userExpiredAt, { httpOnly: true, secure: true})
            cookieStore.set('count-token', userGeneratedCount, { httpOnly: true, secure: true})
            cookieStore.set('id-token', idToken, { httpOnly: true, secure: true})
        }

        return data;
    }catch (err) {
        throw err;
    }

}