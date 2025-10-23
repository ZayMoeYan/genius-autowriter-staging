import type { ReactNode } from "react";
import {Nav} from "@/components/Nav";



interface Props {
    readonly children: ReactNode;
}

export default function RootLayout({ children }: Props) {
    return (
        <div>
            <Nav/>
            {children}
        </div>
    );
}

