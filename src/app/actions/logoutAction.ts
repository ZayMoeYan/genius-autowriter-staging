'use server';

import {cookies} from "next/headers";

export async function logout() {

    const cookieStore = await cookies();
    cookieStore.delete('access-token');
    cookieStore.delete('apikey-token');
    cookieStore.delete('role-token');
    cookieStore.delete('username-token');
    cookieStore.delete('email-token');
    cookieStore.delete('createdAt-token');
    cookieStore.delete('expiredAt-token');
    cookieStore.delete('count-token');
}