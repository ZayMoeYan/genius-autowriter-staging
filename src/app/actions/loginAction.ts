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

        const data = await res.json();

        const userRole = jwt.sign(data.role, process.env.NEXT_SECRET_KEY!);
        const name = jwt.sign(data.username, process.env.NEXT_SECRET_KEY!);
        const userEmail = jwt.sign(data.email, process.env.NEXT_SECRET_KEY!);
        const apikeyToken = jwt.sign(apikey, process.env.NEXT_SECRET_KEY!);

        if(data.access_token) {
            const cookieStore = await cookies();
            cookieStore.set('access-token', data.access_token, { httpOnly: true, secure: true});
            cookieStore.set('apikey-token', apikeyToken, { httpOnly: true, secure: true});
            cookieStore.set('role_token', userRole, { httpOnly: true, secure: true})
            cookieStore.set('username_token', name, { httpOnly: true, secure: true})
            cookieStore.set('email_token', userEmail, { httpOnly: true, secure: true})
        }

        return data;
    }catch (err) {
        throw err;
    }

}