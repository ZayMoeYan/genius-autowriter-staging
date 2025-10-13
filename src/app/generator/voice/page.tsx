import VoiceChatDemo from "@/app/generator/voice/components/VoiceChatDemo";
import WithAuth from "@/app/HOC/WithAuth";

function Page() {

    return (
        <div>
            <VoiceChatDemo/>
        </div>
    );
}

export default WithAuth(Page);