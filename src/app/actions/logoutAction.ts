'use server';

import {cookies} from "next/headers";

export async function logout() {

    const cookieStore = await cookies();
    cookieStore.delete('access-token');
    cookieStore.delete('token-type');
    cookieStore.delete('role');
    cookieStore.delete('username');
    cookieStore.delete('email');
}