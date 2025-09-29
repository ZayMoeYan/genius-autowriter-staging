import WithAuth from "@/app/HOC/WithAuth";
import Dashboard from "@/app/dashboard/components/Dashboard";

function Page() {
    return (
        <div>
            <Dashboard/>
        </div>
    );
}

export default WithAuth(Page);