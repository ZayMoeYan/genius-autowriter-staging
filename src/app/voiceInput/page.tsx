import VoiceInput from "@/app/voiceInput/components/VoiceInput";
import MyVoiceInput from "@/app/voiceInput/components/MyVoiceInput";
import VoiceRecorder from "@/app/voiceInput/components/VoiceRecorder";

export default function Page() {

    return (
        <div  className={'min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20'}>
          <VoiceInput/>
            <MyVoiceInput/>
            <VoiceRecorder/>
        </div>
    );
}