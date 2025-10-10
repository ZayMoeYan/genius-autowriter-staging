'use server';

import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

export async function getValueFromCookies(key: string) {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value!;
}

export async function getLoginUser() {
    const cookieStore = await cookies();

    const roleFromCookie = cookieStore.get('role_token')?.value!;
    const usernameFromCookie = cookieStore.get('role_token')?.value!;
    const emailFromCookie = cookieStore.get('role_token')?.value!;

    const role =  jwt.verify(roleFromCookie, process.env.NEXT_SECRET_KEY!)
    const username = jwt.verify(usernameFromCookie, process.env.NEXT_SECRET_KEY!)
    const email = jwt.verify(emailFromCookie, process.env.NEXT_SECRET_KEY!)

    const currentUser = {
        "username": username,
        "role": role,
        "email": email,
        "isLoggedIn": cookieStore.get('access_token')?.value,
        "id": cookieStore.get('id')?.value
    }
    return currentUser;
}