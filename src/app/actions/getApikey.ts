'use server';
import {getValueFromCookies} from "@/app/actions/getLoginUser";
import jwt from "jsonwebtoken";

export default async function getApikey() {
    const apikeyToken = await getValueFromCookies('apikey-token');
    return jwt.verify(apikeyToken, process.env.NEXT_SECRET_KEY!)
}

