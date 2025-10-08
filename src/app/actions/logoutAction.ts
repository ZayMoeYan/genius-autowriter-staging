'use server';

import {cookies} from "next/headers";

export async function logout() {

    const cookieStore = await cookies();
    cookieStore.delete('access-token');
    cookieStore.delete('apikey-token');
    cookieStore.delete('role_token');
    cookieStore.delete('username_token');
    cookieStore.delete('email_tokenx');
}