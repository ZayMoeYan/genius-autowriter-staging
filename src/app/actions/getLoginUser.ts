'use server';

import {cookies} from "next/headers";
import {CurrentUserType} from "@/components/Nav";

export async function getLoginUser() {

    const cookieStore = await cookies();
    const currentUser = {
        "username" : cookieStore.get('username')?.value,
        "role": cookieStore.get('role')?.value,
        "email": cookieStore.get('email')?.value,
        "isLoggedIn": cookieStore.get('access-token')?.value
    }
    return currentUser;
}