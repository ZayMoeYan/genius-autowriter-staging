import VoiceChatDemo from "@/app/generator/voice/components/VoiceChatDemo";
import WithAuth from "@/app/HOC/WithAuth";
import {getLoginUser} from "@/app/actions/getLoginUser";
import {redirect} from "next/navigation";

async function Page() {

    const user = await getLoginUser()

    if(user.role === 'TRIAL') {
        redirect('/generator');
    }

    return (
        <div>
            <VoiceChatDemo/>
        </div>
    );
}

export default WithAuth(Page);