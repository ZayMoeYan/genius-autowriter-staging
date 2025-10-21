'use server';

import {cookies} from "next/headers";
import jwt from "jsonwebtoken";

export async function getValueFromCookies(key: string) {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value!;
}

export async function getLoginUser() {
    const cookieStore = await cookies();

    const roleFromCookie = cookieStore.get('role-token')?.value!;
    const usernameFromCookie = cookieStore.get('username-token')?.value!;
    const emailFromCookie = cookieStore.get('email-token')?.value!;

    const username = jwt.verify(usernameFromCookie, process.env.NEXT_SECRET_KEY!)
    const email = jwt.verify(emailFromCookie, process.env.NEXT_SECRET_KEY!)
    const role =  jwt.verify(roleFromCookie, process.env.NEXT_SECRET_KEY!)

    if(role !== "ADMIN") {
        const createdAtFromCookie = cookieStore.get('createdAt-token')?.value!;
        const expiredAtFromCookie = cookieStore.get('expiredAt-token')?.value!;
        const countFromCookie = cookieStore.get('count-token')?.value!;
        const idFromCookie = cookieStore.get('id-token')?.value!;
        const createdAt = jwt.verify(createdAtFromCookie, process.env.NEXT_SECRET_KEY!)
        const expiredAt = jwt.verify(expiredAtFromCookie, process.env.NEXT_SECRET_KEY!)
        const generatedCount = jwt.verify(countFromCookie, process.env.NEXT_SECRET_KEY!)
        const id = jwt.verify(idFromCookie, process.env.NEXT_SECRET_KEY!)

        return {
            id,
            username,
            role,
            email,
            createdAt,
            expiredAt,
            generatedCount,
            "isLoggedIn": cookieStore.get('access-token')?.value,
        }
    }

    const currentUser = {
        username,
        role,
        email,
        "isLoggedIn": cookieStore.get('access-token')?.value,
    }
    return currentUser;
}