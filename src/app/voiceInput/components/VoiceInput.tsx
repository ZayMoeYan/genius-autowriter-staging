'use client';
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import MyVoiceInput from "@/app/voiceInput/components/MyVoiceInput";

export default function VoiceInput() {
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null);

    const toggleListening = () => {

        const SpeechRecognition =
            // @ts-ignore
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser doesn't support speech recognition.");
            return;
        }

        // If currently listening → stop it
        if (listening && recognitionRef.current) {
            // @ts-ignore
            recognitionRef.current?.stop();
            setListening(false);
            return;
        }

        // Otherwise → start new recognition session
        const recognition = new SpeechRecognition();
        recognition.lang = "my-MM"; // ✅ Burmese language
        recognition.interimResults = false;
        recognition.continuous = false;

        recognitionRef.current = recognition;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onerror = (e: any) => {
            console.error(e);
            setListening(false);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
           console.log(transcript)
        };

        recognition.start();
    };

    return (

            <Button
                onClick={toggleListening}
                variant={listening ? "destructive" : "default"}
            >
                {listening ? "🛑 Stop Listening" : "🎤 Speak in Burmese"}
            </Button>



    );
}
