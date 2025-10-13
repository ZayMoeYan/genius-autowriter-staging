"use client";

import {useEffect, useRef, useState} from "react";
import {Users, Wand2, BarChart3, LogOut, User, Shield, Menu, X, Mic} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {logout} from "@/app/actions/logoutAction";

import motLogo from '@/app/images/MOT.png';
import {useToast} from "@/hooks/use-toast";
import { useAuth} from "@/app/context/AuthProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {useTranslation} from "react-i18next";
import {getUser} from "@/app/actions/usersAction";

export const UserNav = () => {

    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const { currentUser, setCurrentUser } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [generatedCount, setGeneratedCount] = useState();
    const { t } = useTranslation();

    useEffect(() => {
        if(currentUser?.id) {
            getUser(currentUser?.id).then(user => setGeneratedCount(user.generated_count))
        }
    }, [currentUser, setCurrentUser]);

    const handleLogout = async () => {
        await logout();
        toast({
            title: t("logoutSuccessTitle"),
            description: t("logoutSuccessDescription", {
                role: currentUser?.role,
                username: currentUser?.username
            }),
            status: "success",
        });
        setCurrentUser(null);
        router.push('/login');
    }

    const isActive = (page: string) => {
        return pathname === page;
    };

    return (
        <nav className="shadow-lg w-full bg-black text-white fixed z-10 border-red-800 border-b-[0.5px]">

            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>

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
                        fixed md:static top-16 left-0 w-full md:w-auto bg-black md:bg-transparent 
                        p-4 md:p-0 space-y-4 md:space-y-0 transition-all duration-300 ease-in-out 
                        ${menuOpen ? "flex" : "hidden"}`}
                    >

                    <div className="flex flex-row md:flex-row md:space-x-2 ">
                                <Link href="/generator">
                                    <Button
                                        variant="ghost"
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                                            isActive('/generator')
                                                ? 'bg-red-600 text-white hover:bg-red-700'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                    >
                                        <Wand2 className="h-4 w-4" />
                                        <span>{t("generator")}</span>
                                    </Button>
                                </Link>

                                <Link href="/generator/voice">
                                    <Button
                                        variant="ghost"
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                                            isActive('/generator/voice')
                                                ? 'bg-red-600 text-white hover:bg-red-700'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                    >
                                        <Mic className="h-4 w-4" />
                                        <span>{t("voiceRecord.navTitle")}</span>
                                    </Button>
                                </Link>

                                <Link href="/dashboard">
                                    <Button
                                        variant="ghost"
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                                            isActive('/dashboard')
                                                ? 'bg-red-600 text-white hover:bg-red-700'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                    >
                                        <BarChart3 className="h-4 w-4" />
                                        <span>{t("dashboard")}</span>
                                    </Button>
                                </Link>


                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between md:items-center border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6 lg:pl-6 space-y-4 md:space-y-0 md:space-x-4">
                        {/* User Info */}
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-9 w-9 bg-gray-700 border border-gray-600">
                                <div className="flex items-center justify-center h-full w-full">
                                    <User className="h-5 w-5 text-gray-300" />
                                </div>
                            </Avatar>

                            <div className="flex flex-col ">
                                <div className="flex items-center space-x-2">
                                    <span className="text-white font-medium">{currentUser?.username}</span>
                                    <Badge
                                        variant={"secondary"}
                                        className={`text-xs bg-gray-600 text-gray-200 hover:bg-gray-70 `}
                                    >
                                        {currentUser?.role}
                                    </Badge>
                                    {
                                        currentUser?.role === "TRIAL" && generatedCount! >= 0 ? <span>Credit <span className={'bg-gray-700 rounded-xl px-1.5'} >{generatedCount}</span></span>
                                            : currentUser?.role === "TRIAL" ?
                                                <svg
                                                    className="animate-spin -ml-1 mr-1 sm:mr-2 h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373
                                           0 0 5.373 0 12h4zm2 5.291A7.962
                                           7.962 0 014 12H0c0 3.042 1.135
                                           5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg> : ''
                                    }
                                </div>
                                <span className="text-gray-400 text-xs">{currentUser?.email}</span>
                            </div>
                        </div>

                        {/* Logout + Language Switcher */}
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 w-full md:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition-all w-full md:w-auto"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                {t("logout")}
                            </Button>

                            <div className="w-full md:w-auto">
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>




                </div>
            </div>
        </nav>
    );
};
