"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function VoiceRecorder() {
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef<any>(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        // @ts-ignore
        mediaRecorder.ondataavailable = (e: any) => chunksRef.current.push(e.data);

        mediaRecorder.onstop = async () => {
            const blob = new Blob(chunksRef.current, { type: "audio/webm" });
            chunksRef.current = [];
            const formData = new FormData();
            formData.append("file", blob, "speech.webm");

            console.log(formData)


            // const res = await fetch("http://localhost:8000/api/voice-to-text", {
            //     method: "POST",
            //     body: formData,
            // });
            //
            // const data = await res.json();
            // if (data.text) onResult(data.text);
        };

        mediaRecorder.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    };

    return (
        <Button className={'text-white bg-gray-700 px-3 py-2 rounded'} onClick={recording ? stopRecording : startRecording}>
            {recording ? "🛑 Stop Recording" : "🎤 Speak in Burmese"}
        </Button>
    );
}
