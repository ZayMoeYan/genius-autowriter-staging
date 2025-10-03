'use client';

import { useState } from "react";
import { login } from "@/app/actions/loginAction";
import { Eye, EyeOff } from "lucide-react";
import motLogo from '@/app/images/MOT.png';
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthProvider";
import { useToast } from "@/hooks/use-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required."),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { setCurrentUser } = useAuth();

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset,} = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const handleLogin = async (data: LoginSchema) => {
        try {
            const user = await login(data.email, data.password);
            user.role === "Admin"
                ? router.push('/admin')
                : router.push('/generator');

            toast({
                title: `Login Success! Welcome back, ${user.username}`,
                description: `${user.role} ${user.username}၊ သင့်ရဲ့ Account ထဲကို ရောက်ရှိပါပြီ။`,
                status: "success",
            });



            reset();
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: "ကျေးဇူးပြု၍ ပြန်လည်စစ်ဆေးပါ။ သင်ထည့်သွင်းသော email သို့မဟုတ် password သည် မှားယွင်းနေပါသည်။",
                status: "error",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_50%)]"></div>

            <div className="relative z-10 w-full max-w-md mt-20">
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

                    <div className="space-y-6">

                        <div>
                            <label className="block text-white mb-2">Email</label>
                            <input
                                type="text"
                                {...register("email")}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/90"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-white mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password")}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/90"
                                    placeholder="Enter your password"
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
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Logging in...
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500">Powered by Myanmar Online Technology</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
