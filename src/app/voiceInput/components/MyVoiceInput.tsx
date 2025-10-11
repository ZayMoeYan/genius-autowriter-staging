'use client';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function MyVoiceInput() {
    const { transcript } = useSpeechRecognition();

    return (
        <div className={'text-white'} >
            <button onClick={() => SpeechRecognition.startListening({ language: 'my-MM' })}>
                🎤 Start
            </button>
            <button onClick={SpeechRecognition.stopListening}>🛑 Stop</button>
            <p>{transcript}</p>
        </div>
    );
}
