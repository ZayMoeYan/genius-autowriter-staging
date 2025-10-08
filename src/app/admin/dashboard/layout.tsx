import type { ReactNode } from "react";
import {AdminNav} from "@/app/admin/dashboard/components/AdminNav";



interface Props {
    readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
    return (
        <div>
            <AdminNav/>
            {children}
        </div>
    );
}

