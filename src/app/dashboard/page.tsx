import WithAuth from "@/app/HOC/WithAuth";
import Dashboard from "@/app/dashboard/components/Dashboard";
import {getLoginUser} from "@/app/actions/getLoginUser";
import {redirect} from "next/navigation";

async function Page() {

    const user = await getLoginUser();

    if(user.role === "Admin") {
        redirect('/admin/dashboard')
    }

    return (
        <div>
            <Dashboard/>
        </div>
    );
}

export default WithAuth(Page);