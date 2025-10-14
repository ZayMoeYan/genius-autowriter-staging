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
import { useAuth} from "@/app/context/AuthProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export type CurrentUserType = {
    id: number | undefined
    username: string | undefined
    role: string | undefined
    isLoggedIn: string | undefined
    email: string | undefined
    expiredAt: string | undefined
    generatedCount: number
}

export const Nav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const { currentUser, setCurrentUser } = useAuth();
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
        <nav className="shadow-lg w-full bg-black text-white fixed z-10 border-red-800 border-b-[0.5px]">
            {/* Red accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>

            <div className="flex flex-row py-4 justify-between w-[90%] max-w-7xl items-center mx-auto">
                {/* Logo Section */}
                <div className="flex items-center space-x-3 cursor-pointer">
                    <img src={motLogo.src} alt="MOT Logo" className="h-10 w-auto md:h-12" />
                    <div className="flex flex-col">
                        <span className="text-red-500 text-xl md:text-2xl tracking-wider font-bold">
                            Genius Autowriter
                        </span>
                    </div>
                </div>


                {/* Mobile menu button */}
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

                {/* Links + User Section */}
                <div
                    className={`flex-col md:flex md:flex-row md:items-center md:space-x-6 
                        fixed md:static top-16 left-0 w-full md:w-auto bg-black md:bg-transparent 
                        p-4 md:p-0 space-y-4 md:space-y-0 transition-all duration-300 ease-in-out 
                        ${menuOpen ? "flex" : "hidden"}`}
                >
                    {/* Links */}
                    <div className="flex flex-row md:flex-row md:space-x-2">
                        {currentUser?.isLoggedIn && currentUser?.role === "Admin" && (
                            <Link href="/admin">
                                <Button
                                    variant="ghost"
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                                        isActive('/admin')
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <Users className="h-4 w-4" />
                                    <span>Users</span>
                                </Button>
                            </Link>
                        )}

                        {currentUser?.isLoggedIn && currentUser?.role !== "Admin" && (
                            <>
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
                                        <span>Generator</span>
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
                                        <span>Dashboard</span>
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>


                    {/* User Section */}
                    {currentUser?.isLoggedIn ? (
                        <div className="flex flex-row justify-between items-center md:flex-row md:items-center md:space-x-4  md:border-l lg:pl-6 lg:border-l md:pl-6 border-gray-700 pt-4 md:pt-0">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-9 w-9 bg-gray-700 border border-gray-600">
                                    <div className="flex items-center justify-center h-full w-full">
                                        <User className="h-5 w-5 text-gray-300" />
                                    </div>
                                </Avatar>
                                <div className="flex flex-col">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-white font-medium">{currentUser.username}</span>
                                        <Badge
                                            variant={currentUser.role === 'Admin' ? 'default' : 'secondary'}
                                            className={`text-xs ${
                                                currentUser.role === 'Admin'
                                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                                    : 'bg-gray-600 text-gray-200 hover:bg-gray-700'
                                            }`}
                                        >
                                            {currentUser.role === 'Admin' && <Shield className="h-3 w-3 mr-1" />}
                                            {currentUser.role}
                                        </Badge>
                                    </div>
                                    <span className="text-gray-400 text-xs">{currentUser?.email}</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 md:mt-0 border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button className="bg-red-600 hover:bg-red-700 text-white transition-colors"
                                onClick={() => router.push('/login')}
                        >
                            Login
                        </Button>
                    )}
                    <LanguageSwitcher/>

                </div>
            </div>
        </nav>
    );
};
