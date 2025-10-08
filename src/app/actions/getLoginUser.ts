'use server';

import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

export async function getValueFromCookies(key: string) {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value!;
}

export async function getLoginUser() {

    const roleFromCookie = await getValueFromCookies('role_token');
    const usernameFromCookie = await getValueFromCookies('username_token');
    const emailFromCookie = await getValueFromCookies('email_token');

    const role =  jwt.verify(roleFromCookie, process.env.NEXT_SECRET_KEY!)
    const username = jwt.verify(usernameFromCookie, process.env.NEXT_SECRET_KEY!)
    const email = jwt.verify(emailFromCookie, process.env.NEXT_SECRET_KEY!)

    const currentUser = {
        "username": username,
        "role": role,
        "email": email,
        "isLoggedIn": getValueFromCookies('access_token')
    }
    return currentUser;
}