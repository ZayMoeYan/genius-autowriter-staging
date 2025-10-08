import ContentGeneratorUi from '@/app/generator/components/content-generator-ui';
import WithAuth from "@/app/HOC/WithAuth";
import {getLoginUser} from "@/app/actions/getLoginUser";
import {redirect} from "next/navigation";


async function Page() {

    const user = await getLoginUser();

    if(user.role === "Admin") {
        redirect('/admin/dashboard')
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
                <ContentGeneratorUi />
        </div>
    );
}

export default WithAuth(Page);

