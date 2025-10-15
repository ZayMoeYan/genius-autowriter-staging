import { useState } from "react";
import { Eye, EyeOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
// @ts-ignore
import { DateTime } from "luxon";

function UserForm({
                      onSubmit,
                      onCancel,
                      isSaving,
                      onSuccess,
                  }: {
    onSubmit: (
        username: string,
        email: string,
        password: string,
        role: string,
        trialExpiresAt?: string
    ) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
    onSuccess: () => void;
}) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");
    const [showPassword, setShowPassword] = useState(false);
    const [trialExpiresAt, setTrialExpiresAt] = useState("");

    // Validation errors
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        trialExpiresAt: "",
    });

    const validateForm = () => {
        const newErrors = { username: "", email: "", password: "", trialExpiresAt: "" };
        let isValid = true;

        if (!username.trim()) {
            newErrors.username = "Username is required.";
            isValid = false;
        }

        if (!email.trim()) {
            newErrors.email = "Email is required.";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address.";
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = "Password is required.";
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
            isValid = false;
        }

        if (role === "USER" && !trialExpiresAt) {
            newErrors.trialExpiresAt = "Expiration date is required for users.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Convert to Asia/Yangon ISO string
        let yangonISO: string | undefined;
        if (trialExpiresAt) {
            const dt = DateTime.fromISO(trialExpiresAt, { zone: "Asia/Yangon" });
            yangonISO = dt.toISO();
        }

        await onSubmit(username, email, password, role, yangonISO);
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("USER");
        setTrialExpiresAt("");
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                    type="text"
                    placeholder="Enter username"
                    className={`w-full px-4 py-3 border rounded-lg outline-0 focus:ring-2 ${
                        errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-500"
                    }`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                    type="email"
                    placeholder="Enter email"
                    className={`w-full px-4 py-3 border rounded-lg outline-0 focus:ring-2 ${
                        errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-500"
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg outline-0 focus:ring-2 ${
                            errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-500"
                        }`}
                        placeholder="Enter password"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Role */}
            <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="border border-gray-300 outline-0 focus:ring-red-500">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USER">USER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                        <SelectItem value="TRIAL">TRIAL</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {role === "USER" && (
                <div>
                    <label className="block text-gray-700 mb-2">Expiration</label>
                    <input
                        type="datetime-local"
                        className={`w-full px-4 py-3 border rounded-lg outline-0 focus:ring-2 ${
                            errors.trialExpiresAt ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-red-500"
                        }`}
                        value={trialExpiresAt}
                        onChange={(e) => setTrialExpiresAt(e.target.value)}
                    />
                    {errors.trialExpiresAt && (
                        <p className="text-red-500 text-sm mt-1">{errors.trialExpiresAt}</p>
                    )}
                </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                    className="border-gray-300 text-black hover:bg-gray-100 hover:text-black"
                    disabled={isSaving}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z"
                                />
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4 mr-2" />
                            Create User
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

export default UserForm;
