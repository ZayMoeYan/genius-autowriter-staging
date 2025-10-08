import type { ReactNode } from "react";
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

