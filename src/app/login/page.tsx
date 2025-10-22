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
    apikey: z.string().min(1)
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

            const keyValid = await testApiKey(data.apikey);

            if (!keyValid) {
                toast({
                    title: t("loginFailedTitle"),
                    description: t("loginFailedDescription.invalidKey"),
                    status: "error",
                });
                return;
            }

            const res = await login(data.email, data.password, data.apikey);

            if (!res.ok && res.ok !== undefined) {
                if (res.status === 403) {
                    toast({
                        title: t("loginFailedTitle"),
                        description: t("loginFailedDescription.deactivate"),
                        status: "error",
                    });
                } else if (res.status === 402) {
                    toast({
                        title: t("loginFailedTitle"),
                        description: t("loginFailedDescription.expired"),
                        status: "error",
                    });
                } else {
                    toast({
                        title: t("loginFailedTitle"),
                        description: t("loginFailedDescription.incorrect"),
                        status: "error",
                    });
                }
                return;
            }

            const user = res;

            if (user.role === "ADMIN") {
                router.push("/admin/dashboard");
            } else {
                router.push("/generator");
            }

            toast({
                title: t("loginSuccessTitle", { username: user.username }),
                description: t("loginSuccessDescription", {
                    role: user.role,
                    username: user.username,
                }),
                status: "success",
            });

            reset();

        } catch (err: any) {
            toast({
                title: t("loginFailedTitle"),
                description: t("loginFailedDescription.incorrect"),
                status: "error",
            });
        }
    };



    return (
        <div className="flex items-center justify-center h-[140vh] z-0 px-4 mx-5 md:mx-0 lg:mx-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_50%)]"></div>

            <div className="relative w-full max-w-md z-0 mt-10">
                <form
                    onSubmit={handleSubmit(handleLogin)}
                    className="bg-black backdrop-blur-sm px-8 pt-1 pb-5 rounded-2xl shadow-2xl border-[0.5px] border-red-800"
                >
                    {/* Logo and Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4 h-14">
                            <img
                                src={motLogo.src}
                                alt="MOT Logo"
                                className="h-full w-auto"
                            />
                        </div>
                        <h1 className={`text-white font-bold mb-2 ${i18n.language === "mm" ? 'text-xl' : 'text-3xl'}`}>
                            {t("welcomeBack")}
                        </h1>
                        <p className="text-red-600 tracking-wider font-bold">
                            GENIUS AUTOWRITER
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

                        <div>
                            <label className="block text-white mb-2">{t("apikey")}</label>
                            <input
                                type="text"
                                {...register("apikey")}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/90"
                                placeholder={t("enterApiKey")}
                            />
                            {errors.apikey && (
                                <p className="text-red-500 text-sm mt-1">{t("apiKeyRequired")}</p>
                            )}
                        </div>

                        <div className={'flex items-center justify-center'} >
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-[80%] md:w-full lg:w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
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

                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-zinc-700 text-sm pt-8">{t("poweredBy")}</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
