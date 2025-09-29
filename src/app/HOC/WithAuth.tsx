import {ComponentType} from "react";

import {redirect} from "next/navigation";
import getToken from "@/app/actions/getToken";

export default function WithAuth<T>(Component: ComponentType<T>) {

    return async (props: T) => {

        const token = await getToken();

        if(!token?.value) {
            redirect('/login');
        }

        return (
            <>
                <Component {...props!}/>
            </>
        );
    }
}
