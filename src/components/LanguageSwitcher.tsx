"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import mmLogo from "@/app/images/MyanmarFlag.png";
import enLogo from "@/app/images/UKFlag.png";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const languageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node | null;
            if (!isOpen) return;

            if (languageRef.current && languageRef.current.contains(target)) return;

            setIsOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        const savedLang = localStorage.getItem("lang");
        if (savedLang && savedLang !== i18n.language) {
            i18n.changeLanguage(savedLang);
        }
    }, [i18n]);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("lang", lng);
        setIsOpen(false);
    };

    const languages = [
        { code: "en", label: "EN", flag: enLogo.src },
        { code: "mm", label: "MM", flag: mmLogo.src }
    ];

    return (
        <div ref={languageRef} className="relative select-none text-black w-fit md:w-[140px]">
            {/* Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full gap-2 bg-white px-3 py-1.5 rounded-lg shadow hover:bg-gray-100 border border-gray-200 transition"
            >
                <div className={'flex space-x-2 items-center'} >
                    <img
                        src={i18n.language === "en" ? enLogo.src : mmLogo.src}
                        alt="Language"
                        className="h-5 w-5 rounded-full"
                    />
                    <span className="font-medium uppercase text-black">
                    {i18n.language}
                 </span>
                </div>
                <svg
                    className={`w-4 h-4 transform transition  ${isOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 9l-7 7-7-7"/>
                </svg>
            </div>

            {isOpen && (
                <div className="absolute w-full mt-2   bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden z-50">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100 transition"
                            onClick={() => changeLanguage(lang.code)}
                        >
                            <img src={lang.flag} alt={lang.label} className="h-5 w-5 rounded-full" />
                            <span className="text-sm text-black">{lang.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
