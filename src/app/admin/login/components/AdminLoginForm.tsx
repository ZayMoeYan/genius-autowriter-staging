'use client';

import { useState } from "react";
import { login } from "@/app/actions/loginAction";
import { Eye, EyeOff } from "lucide-react";
import motLogo from '@/app/images/MOT.png';
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {testApiKey} from "@/app/actions/testApiKeyAction";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
    email: z.string().min(1).email(),
    password: z.string().min(1),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { t, i18n } = useTranslation();

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset,} = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const handleLogin = async (data: LoginSchema) => {
        try {

                const user = await login(data.email, data.password, "");
                user.role === "Admin" && router.push('/admin/dashboard');

                toast({
                    title: t("loginSuccessTitle", {username : user?.username}),
                    description: t("loginSuccessDescription", {
                        role: user?.role,
                        username: user?.username
                    }),
                    status: "success",
                });

                reset();
        } catch (error: any) {
            toast({
                title: `${t("loginFailedTitle")}`,
                description: `${t("loginFailedDescription")}`,
                status: "error",
            });
        }
    };

    // @ts-ignore
    return (
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center h-[120vh] z-0 p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_50%)]"></div>

            <div className="relative w-full max-w-md z-0">
                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className="bg-black backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-red-800"
                >
                    {/* Logo and Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <img
                                src={motLogo.src}
                                alt="MOT Logo"
                                className="h-14 w-auto"
                            />
                        </div>
                        <h2 className={`text-white font-bold mb-2 ${i18n.language === "mm" ? 'text-xl' : 'text-2xl'}`}>
                            {t("welcomeBack")}
                        </h2>
                        <p className="text-red-600 tracking-wider font-bold">
                            GENIUS AUTOWRITER ADMIN LOGIN
                        </p>
                    </div>

                    <div className="space-y-6">

                        <div>
                            <label className="block text-white mb-2">{t("email")}</label>
                            <input
                                type="text"
                                {...register("email")}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/90"
                                placeholder={t("enterEmail")}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{t("invalidEmail")}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-white mb-2">{t("password")}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/90"
                                    placeholder={t("enterPassword")}
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
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{t("passwordRequired")}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    {t("loggingIn")}
                                </div>
                            ) : (
                                t("login")
                            )}
                        </button>

                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500">{t("poweredBy")}</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
