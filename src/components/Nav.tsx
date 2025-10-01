"use client";

import { useEffect, useState } from "react";
import { Users, Wand2, BarChart3, LogOut, User, Shield, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {logout} from "@/app/actions/logoutAction";
import {getLoginUser} from "@/app/actions/getLoginUser";

import motLogo from '@/app/images/MOT.png';
import getToken from "@/app/actions/getToken";

export type CurrentUserType = {
    username: string | undefined,
    role: string | undefined,
    isLoggedIn: string | undefined
    email: string | undefined
}

export const Nav = () => {

    const router = useRouter();
    const pathname = usePathname();
    const [currentUser, setCurrentUser] = useState<CurrentUserType>();

    useEffect(() => {
        getLoginUser().then(user => {
            setCurrentUser(user)
        })
    }, []);

    const handleLogout = async () => {
        await logout();
        window.location.reload();
        router.push('/login');
        console.log('Logout clicked');
    }

    const isActive = (page: string) => {
        return pathname === page;
    };

    return (
        <nav className={'shadow-lg w-full justify-center flex bg-black text-white fixed z-10 border-red-800 border-b-[0.5px]'}>
            {/* Subtle red accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>

            <div className={'flex flex-row py-4 justify-between w-[90%] max-w-7xl items-center'}>
                {/* Logo Section */}
                <div className="flex items-center space-x-3 cursor-pointer" >
                    <img
                        src={motLogo.src}
                        alt="MOT Logo"
                        className="h-12 w-auto"
                    />
                    <div className="flex flex-col">
                        <span className="text-red-500 text-2xl tracking-wider font-bold m-0 p-0">Genius Autowriter</span>
                    </div>
                </div>

                <div className={'flex flex-row items-center space-x-6'}>
                    <div className="flex items-center space-x-1">
                        {currentUser?.isLoggedIn && currentUser?.role === "Admin" && (
                            <Link href={"/admin"} >
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
                            <Link href={"/generator"} >
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
                        )}

                        {currentUser?.isLoggedIn && currentUser?.role !== "Admin" && (
                            <Link href={"/dashboard"} >
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
                        )}
                    </div>

                    {/* User Profile Section */}
                    {currentUser?.isLoggedIn ? (
                        <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-700">
                            {/* User Info */}
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-9 w-9 bg-gray-700 border border-gray-600">
                                    <div className="flex items-center justify-center h-full w-full">
                                        <User className="h-5 w-5 text-gray-300" />
                                    </div>
                                </Avatar>

                                <div className="flex flex-col">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-white font-medium">
                                            {currentUser.username}
                                        </span>
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
                                    <span className="text-gray-400 text-xs">
                                        {currentUser?.email}
                                    </span>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white transition-colors"
                        >
                            Login
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
};