'use server';

import {cookies} from "next/headers";
import {CurrentUserType} from "@/components/Nav";
import jwt from "jsonwebtoken";

export async function getLoginUser() {

    const cookieStore = await cookies();
    const role = jwt.verify(cookieStore.get('role')?.value!, process.env.NEXT_SECRET_KEY!)
    const username = jwt.verify(cookieStore.get('username')?.value!, process.env.NEXT_SECRET_KEY!)
    const email = jwt.verify(cookieStore.get('email')?.value!, process.env.NEXT_SECRET_KEY!)
    const currentUser = {
        "username" : username,
        "role": role,
        "email": email,
        "isLoggedIn": cookieStore.get('access-token')?.value
    }
    return currentUser;
}