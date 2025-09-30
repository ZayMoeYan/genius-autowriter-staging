'use client';

import { useState } from "react";
import {login} from "@/app/actions/loginAction";
import {useRouter} from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import motLogo from '@/app/images/MOT.png';
import {getLoginUser} from "@/app/actions/getLoginUser";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try{
            const role = await login(email, password);

            if(role === "Admin") {
                window.location.href = "/admin";
            }else {
                window.location.href = "/generator";
            }

        }finally {
            setLoading(false)
            setEmail("");
            setPassword("")
        }

    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
            {/* Background pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_50%)]"></div>

            <div className="relative z-10 w-full max-w-md mt-20">
                <form
                    onSubmit={handleLogin}
                    className="bg-black backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-red-800"
                >
                    {/* Logo and Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <img
                                src={motLogo.src}
                                alt="MOT Logo"
                                className="h-20 w-auto"
                            />
                        </div>
                        <h2 className="text-white text-3xl font-bold mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-red-600 tracking-wider font-bold">
                            GENIUS AUTOWRITER
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6">
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                                {error}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-white mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/90"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/90"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Logging in...
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500">
                            Powered by Myanmar Online Technology
                        </p>
                    </div>
                </form>

                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-600/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-red-600/5 rounded-full blur-xl"></div>
            </div>
        </div>
    );
}