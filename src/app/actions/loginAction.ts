'use server';

import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

export async function login(username: string, password: string) {
    try {
        const res = await fetch("https://genius-autowriter-backend.vercel.app/auth/login", {
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

        if(data.access_token) {
            const cookieStore = await cookies();
            cookieStore.set('access-token', data.access_token, { httpOnly: true});
            cookieStore.set('role', userRole, { httpOnly: true})
            cookieStore.set('username', name, { httpOnly: true})
            cookieStore.set('email', userEmail, { httpOnly: true})
        }

        return data;
    }catch (err) {
        throw err;
    }

}