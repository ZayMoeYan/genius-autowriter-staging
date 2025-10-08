'use client';
import {redirect} from "next/navigation";
import getToken from "@/app/actions/getToken";
import {useEffect} from "react";

export default function IndexPage() {
    useEffect(() => {
        getToken().then(token => token ? redirect('/generator') : redirect('/login'));
    }, []);
}
