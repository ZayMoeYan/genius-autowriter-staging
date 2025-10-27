"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import motLogo from '@/app/images/MOT.png';
import LanguageSwitcher from "@/components/LanguageSwitcher";



export const Nav = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="shadow-lg w-full bg-black text-white fixed z-10 border-red-800 border-b-[1.5px]">

            <div className="flex flex-row py-4 justify-between w-[90%] max-w-7xl items-center mx-auto xl:max-w-full">

                <div className="flex items-center space-x-3 cursor-pointer">
                    <img src={motLogo.src} alt="MOT Logo" className="h-10 w-auto" />
                    <div className="flex flex-col">
                        <span className="text-red-500 text-xl md:text-2xl tracking-wider font-bold">
                            Genius Autowriter
                        </span>
                    </div>
                </div>

                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-gray-800"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>

                <div
                    className={`flex-col
                        fixed right-10 md:right-20 top-[80px] w-fit bg-transparent 
                        transition-all duration-300 ease-in-out 
                        ${menuOpen ? "flex" : "hidden"}`}
                >

                    <LanguageSwitcher/>
                </div>
            </div>
        </nav>
    );
};
