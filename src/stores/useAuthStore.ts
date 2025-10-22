import { create } from "zustand"
import {getLoginUser} from "@/app/actions/getLoginUser";
import {getUser} from "@/app/actions/usersAction";
import {JwtPayload} from "jsonwebtoken";

interface User {
    id: string | JwtPayload
    username: string | JwtPayload
    role: string | JwtPayload
    email: string | JwtPayload
    createdAt: string | JwtPayload
    expiredAt: string | JwtPayload
    generatedCount: string | JwtPayload
    isLoggedIn: string | undefined
}

interface AuthState {
    currentUser:  User | null
    loading: boolean
    setCurrentUser: (user: User | null) => void
    refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
    currentUser: null,
    loading: false,

    setCurrentUser: (user) => set({ currentUser: user }),

    refreshUser: async () => {
        set({ loading: true })
        const user = await getLoginUser()
        if (user) {
            let updated = user
            if (user.role === "TRIAL" && user.id) {
                const curUser = await getUser(+user.id)
                updated = {
                    ...user,
                    generatedCount: curUser.generated_count,
                    expiredAt: curUser.trial_expires_at,
                }
            }
            // @ts-ignore
            set({ currentUser: updated, loading: false })
        } else {
            set({ currentUser: null, loading: false })
        }
    },
}))
