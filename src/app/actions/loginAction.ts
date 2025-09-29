'use server';

import {cookies} from "next/headers";
import {redirect} from "next/navigation";

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

        if(data.access_token) {
            const cookieStore = await cookies();
            cookieStore.set('access-token', data.access_token, { httpOnly: true});
            cookieStore.set('role', data.role, { httpOnly: true})
            cookieStore.set('username', data.username, { httpOnly: true})
            cookieStore.set('email', data.email, { httpOnly: true})
        }

        return data.role;
    }catch (err) {
        throw err;
    }

}