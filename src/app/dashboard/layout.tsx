import type { ReactNode } from "react";
import {Nav} from "@/components/Nav";
import {UserNav} from "@/app/generator/components/UserNav";



interface Props {
    readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
    return (
        <div>
            <UserNav/>
            {children}
        </div>
    );
}

