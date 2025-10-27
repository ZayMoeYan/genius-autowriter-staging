import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface LoadingIndicatorProps {
    progress?: number;
    message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
                                                                      progress = 0,
                                                                      message = "Generating content..."
                                                                  }) => {
    const [displayProgress, setDisplayProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDisplayProgress(progress);
        }, 100);
        return () => clearTimeout(timer);
    }, [progress]);

    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (displayProgress / 100) * circumference;

    return (
        <div className="fixed inset-0  flex items-center justify-center z-50">
            <div className="flex flex-col h-[75%] py-10 mt-20 items-center gap-6 bg-none backdrop-blur-sm w-full">
                <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="54"
                            stroke="rgba(220, 38, 38, 0.1)"
                            strokeWidth="8"
                            fill="none"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="54"
                            stroke="url(#progressGradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-500 ease-out"
                        />
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#dc2626" />
                                <stop offset="50%" stopColor="#ef4444" />
                                <stop offset="100%" stopColor="#dc2626" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-sm" />
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Zap
                            className="w-8 h-8 text-red-600 mb-1 animate-pulse"
                            fill="#dc2626"
                        />
                        <span className="text-2xl text-red-600">
                          {Math.round(displayProgress)}%
                        </span>
                    </div>
                </div>

                {message && (
                    <div className="text-center">
                        <p className="text-white/70">{message}</p>
                        <div className="flex items-center justify-center gap-1 mt-2">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
