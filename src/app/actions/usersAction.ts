'use server';

import axiosInstance from "@/app/axiosInstance";

export async function getUsers() {
    try {
        const res = await axiosInstance.get("/users/");

        if (!res.data) {
            throw new Error(`Failed: ${res.status}`);
        }

        return await res.data;

    } catch (err) {
        throw err;
    }
}

export async function save(newUser: any) {
    try {
        const res = await axiosInstance.post("/auth/register", newUser);

        if (!res.data) {
            throw new Error(`Failed: ${res.status}`);
        }

        return res.data;

    } catch (err) {
        throw err;
    }
}

export async function updateUserOrAdmin(id: number, data: any) {
    try {
        const res = await axiosInstance.put(`/users/${id}`, data);

        if (!res.data) {
            throw new Error(`Failed: ${res.status}`);
        }

        return res.data;

    } catch (err) {
        throw err;
    }
}

export async function deleteUserOrAdmin(id: number) {
    try {
        const res = await axiosInstance.delete(`/users/${id}`);

        if (!res.data) {
            throw new Error(`Failed: ${res.status}`);
        }

        return res.data;

    } catch (err) {
        throw err;
    }
}