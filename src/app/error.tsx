'use client'

import {Nav} from "@/components/Nav";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {



    return (
        <>
            <Nav/>
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-center">

                <h1 className="text-3xl font-bold text-red-600 mb-2">Something went wrong</h1>
                <button
                    onClick={() => reset()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Try again
                </button>
            </div>
        </>
    )
}
