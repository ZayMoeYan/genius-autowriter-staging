"use client"

import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "@/components/ui/toast"

import { cn } from "@/lib/utils"
import {useToast} from "@/hooks/use-toast";

export function Toaster() {
    const { toasts } = useToast()

    return (
        <ToastProvider duration={3000} >
            {toasts.map(function ({ id, title, description, action, ...props }) {
                const isError = props.status === "error"
                const isSuccess = props.status === "success"

                return (
                    <Toast
                        key={id}
                        {...props}
                        className={cn(
                            "text-black shadow-lg",
                            isSuccess &&
                            "bg-gradient-to-r from-green-400 via-green-500 to-green-600",
                            isError &&
                            "bg-gradient-to-r from-red-400 via-red-500 to-red-600"
                        )}
                    >
                        <div className="grid gap-1">
                            {title && <ToastTitle>{title}</ToastTitle>}
                            {description && <ToastDescription>{description}</ToastDescription>}
                        </div>
                        {action}
                        <ToastClose />
                    </Toast>
                )
            })}
            <ToastViewport />
        </ToastProvider>
    )
}
