"use client";

import {useEffect, useRef, useState} from "react";
import {Wand2, BarChart3, LogOut, User, Menu, X, Mic} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {logout} from "@/app/actions/logoutAction";

import motLogo from '@/app/images/MOT.png';
import {useToast} from "@/hooks/use-toast";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {useTranslation} from "react-i18next";
//@ts-ignore
import { DateTime } from "luxon";
import { useAuthStore } from "@/stores/useAuthStore";


export const UserNav = () => {

    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const [generatedCount, setGeneratedCount] = useState();
    const [timeLeft, setTimeLeft] = useState<string | null>(null);
    const { t } = useTranslation();

    const { currentUser, setCurrentUser, refreshUser } = useAuthStore();

    useEffect(() => {
        if (!currentUser) {
            refreshUser()
        }
    }, [currentUser])

    useEffect(() => {

        // @ts-ignore
        setGeneratedCount(currentUser?.generatedCount!)

        if (!currentUser?.expiredAt) return;

        const interval = setInterval(() => {
            const now = DateTime.now().setZone("Asia/Yangon");
            const expiry = DateTime.fromISO(currentUser.expiredAt, { zone: "Asia/Yangon" });

            const diff = expiry.diff(now, ["hours", "minutes", "seconds"]);

            if (diff.valueOf() <= 0) {
                clearInterval(interval);
                handleLogout().then(r => {
                    toast({
                            title: t("trialExpired.title"),
                            description: t("trialExpired.description"),
                            status: "error"
                        }
                    );
                    return;
                });
            }

            const formatted = [
                String(Math.floor(diff.hours)).padStart(2, "0"),
                String(Math.floor(diff.minutes)).padStart(2, "0"),
                String(Math.floor(diff.seconds)).padStart(2, "0"),
            ].join(":");

            setTimeLeft(formatted);
        }, 1000);

        return () => clearInterval(interval);
    }, [currentUser]);

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

    // @ts-ignore
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
                    ref={menuRef}
                    className={`flex-col md:flex md:flex-row md:items-center md:space-x-6 
                        fixed md:static top-16 left-0 w-full md:w-auto bg-black md:bg-transparent 
                        p-4 md:p-0 space-y-4 md:space-y-0 transition-all duration-300 ease-in-out 
                        ${menuOpen ? "flex" : "hidden"}`}
                >
                    <div className="py-2 md:py-0 lg:py-0 flex flex-row md:flex-row md:space-x-2 overflow-x-auto md:overflow-visible no-scrollbar w-full md:w-auto md:border-none lg:border-none border-t-red-600 border-t border-b-red-600 border-b gap-2">
                        <Link href="/generator">
                                <Button
                                    onClick={() => setMenuOpen(false)}
                                    variant="ghost"
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                                        isActive('/generator')
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <Wand2 className="h-4 w-4" />
                                    <span>{t("generator")}</span>
                                </Button>
                            </Link>

                        {
                           !currentUser || currentUser?.role === "TRIAL" ?  '' : <Link href="/generator/voice">
                                <Button
                                    onClick={() => setMenuOpen(false)}
                                    variant="ghost"
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                                        isActive('/generator/voice')
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <Mic className="h-4 w-4" />
                                    <span>{t("voiceRecord.navTitle")}</span>
                                </Button>
                            </Link>
                        }

                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
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

                    <div className="flex flex-col md:flex-row md:justify-between md:items-center  md:border-t-0 md:border-l md:pt-0 md:pl-6 lg:pl-6 space-y-4 md:space-y-0 md:space-x-4">
                        {/* User Info */}
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-11 w-11 bg-gray-700 border border-gray-600">
                                <div className="flex items-center justify-center h-full w-full">
                                    <User className="h-10 w-10 text-gray-300" />
                                </div>
                            </Avatar>

                            {
                                !currentUser ? <svg
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
                                    </svg>  :
                                    <div className="flex flex-col ">
                                        <div className="flex items-center space-x-1">
                                            <span className="text-white font-medium">{currentUser?.username?.split(' ')[0]}</span>
                                            <Badge
                                                variant={"secondary"}
                                                className={`text-xs bg-gray-600 text-gray-200 hover:bg-gray-70 `}
                                            >
                                                {currentUser?.role as string}
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
                                        <span className="text-gray-400 text-xs">{currentUser?.email as string}</span>
                                        {currentUser?.role !== "ADMIN" && currentUser?.expiredAt && (
                                            <span className="text-red-400 text-xs">
                                        Expires in: {timeLeft ?? "Loading..."}
                                      </span>
                                        )}

                                    </div>
                            }
                        </div>

                        {/* Logout + Language Switcher */}
                        <div className="flex items-center md:flex-row  md:items-center gap-2 md:gap-3 w-full md:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition-all w-[80%] md:w-auto"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                {t("logout")}
                            </Button>


                                <LanguageSwitcher />

                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};