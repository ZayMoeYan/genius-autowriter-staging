import AdminDashboard from "@/app/admin/dashboard/components/adminDashboard";
import {getLoginUser} from "@/app/actions/getLoginUser";
import {redirect} from "next/navigation";

export default async function Page() {

    const user = await getLoginUser();

    if(!user) {
        redirect('/admin/login')
    }

    return (
        <AdminDashboard/>
    );
}