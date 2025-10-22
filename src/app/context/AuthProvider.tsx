// "use client";
//
// import {createContext, useContext, useEffect, useRef, useState} from "react";
// import { CurrentUserType } from "@/components/Nav";
//
// type AuthContextType = {
//     currentUser: CurrentUserType | null;
//     setCurrentUser: (user: CurrentUserType | null) => void;
// };
//
// const AuthContext = createContext<AuthContextType | undefined>(undefined);
//
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null);
//
//     return (
//         <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }
//
// export function useAuth() {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within AuthProvider");
//     }
//     return context;
// }
