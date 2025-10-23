"use client";

import {useEffect, useRef, useState} from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter} from "next/navigation";

import motLogo from '@/app/images/MOT.png';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {useAuthStore} from "@/stores/useAuthStore";



export const Nav = () => {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="shadow-lg w-full bg-black text-white fixed z-10 border-red-800 border-b-[1.5px]">

            <div className="flex flex-row py-4 justify-between w-[90%] max-w-7xl items-center mx-auto">

                <div className="flex items-center space-x-3 cursor-pointer">
                    <img src={motLogo.src} alt="MOT Logo" className="h-10 w-auto md:h-12" />
                    <div className="flex flex-col">
                        <span className="text-red-500 text-xl md:text-2xl tracking-wider font-bold">
                            Genius Autowriter
                        </span>
                    </div>
                </div>

                <LanguageSwitcher/>


                {/*<div className="md:hidden flex items-center">*/}
                {/*    <Button*/}
                {/*        variant="ghost"*/}
                {/*        size="icon"*/}
                {/*        className="text-white hover:bg-gray-800"*/}
                {/*        onClick={() => setMenuOpen(!menuOpen)}*/}
                {/*    >*/}
                {/*        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}*/}
                {/*    </Button>*/}
                {/*</div>*/}

                {/*<div*/}
                {/*    className={`flex-col md:flex md:flex-row md:items-center md:space-x-6 */}
                {/*        fixed md:static top-16 right-0 w-[40%] md:w-auto bg-transparent md:bg-transparent */}
                {/*        p-4 md:p-0 space-y-2 md:space-y-0 transition-all duration-300 ease-in-out */}
                {/*        ${menuOpen ? "flex" : "hidden"}`}*/}
                {/*>*/}
                {/*    */}
                {/*</div>*/}
            </div>
        </nav>
    );
};
