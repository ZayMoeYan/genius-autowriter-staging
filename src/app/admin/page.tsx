import AdminDashboard from "@/app/admin/components/adminDashboard";
import WithAuth from "@/app/HOC/WithAuth";
import { getLoginUser } from "@/app/actions/getLoginUser";
import { redirect } from "next/navigation";

async function Page() {

    const user = await getLoginUser();

    if (user.role !== "Admin") {
        redirect("/");
    }

    return (
        <div>
            <AdminDashboard/>
        </div>
    );
}

export default WithAuth(Page);