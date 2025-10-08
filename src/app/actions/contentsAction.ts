"use server";

import {revalidatePath} from "next/cache";
import axiosInstance from "@/app/axiosInstance";

export async function generateContentAction(prompt: string, images: any, apikey: string) {
    try {
        const req = {
            prompt, images, apikey
        }
        const res = await axiosInstance.post("/contents/api/generate", req);

        if (!res.data) {
            throw new Error(`Failed: ${res.status}`);
        }

        return await res.data;

    } catch (err) {
        console.error("Error generating content:", err);
        throw err;
    }
}

export async function saveContent(title: string, content: string) {
    try {
        const res = await axiosInstance.post("/contents/", {title, content});

        if (!res.data) {
            throw new Error(`Failed: ${res.status}`);
        }

        return res.data;

    } catch (err) {
        throw err;
    }
}

export async function getContents() {
    try {
        const res = await axiosInstance.get("/contents/");

        if (!res.data) {
            throw new Error(`Failed: ${res.status}`);
        }

        return await res.data;

    } catch (err) {
        throw err;
    }
}

export async function deleteContent(content_id: number) {
    try {
        const res = await axiosInstance.delete(`/contents/${content_id}`)

        if (!res.data) {
            throw new Error(`Failed: ${res.status}`);
        }

        return await res.data;

    } catch (err) {
        throw err;
    }
}

export async function updateContent(content_id: number, data: any) {
    const res = await axiosInstance.put(`/contents/${content_id}`, data);

    if (!res.data) {
        throw new Error(`Failed to update content: ${res.status}`);
    }

    return await res.data;
}







