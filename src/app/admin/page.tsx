import AdminDashboard from "@/app/admin/components/adminDashboard";
import WithAuth from "@/app/HOC/WithAuth";
import { getLoginUser } from "@/app/actions/getLoginUser";
import { redirect } from "next/navigation";

async function Page() {

    const isAdmin = await getLoginUser();

    if (!isAdmin) {
        redirect("/"); // or /login, /403, etc.
    }

    return (
        <div>
            <AdminDashboard/>
        </div>
    );
}

export default WithAuth(Page);