"use client";

import {useEffect, useRef, useState} from "react";
import { Users, Wand2, BarChart3, LogOut, User, Shield, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {logout} from "@/app/actions/logoutAction";

import motLogo from '@/app/images/MOT.png';
import {useToast} from "@/hooks/use-toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {useAuthStore} from "@/stores/useAuthStore";


export const Nav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const { currentUser, setCurrentUser, refreshUser, loading } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        toast({
            title: `Logout Success!, ${currentUser?.username}`,
            description: `${currentUser?.role} ${currentUser?.username}၊ သင်၏ Account မှ အောင်မြင်စွာ logout လိုက်ပါပြီ။`,
            status: "success",
        });
        setCurrentUser(null);
        router.push('/login');
    }

    const isActive = (page: string) => {
        return pathname === page;
    };

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


                <div className="md:hidden flex items-center">
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
                    className={`flex-col md:flex md:flex-row md:items-center md:space-x-6 
                        fixed md:static top-16 right-5 w-[40%] md:w-auto bg-transparent md:bg-transparent 
                        p-4 md:p-0 space-y-2 md:space-y-0 transition-all duration-300 ease-in-out 
                        ${menuOpen ? "flex" : "hidden"}`}
                >

                    <Button className="bg-red-600 hover:bg-red-700 text-white transition-colors"
                            onClick={() => router.push('/login')}
                    >
                        Login
                    </Button>
                    <LanguageSwitcher/>

                </div>
            </div>
        </nav>
    );
};
