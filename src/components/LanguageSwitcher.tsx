"use client";

import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import mmLogo from "@/app/images/MyanmarFlag.png";
import enLogo from "@/app/images/UKFlag.png";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLang = localStorage.getItem("lang");
        if (savedLang && savedLang !== i18n.language) {
            i18n.changeLanguage(savedLang);
        }
    }, [i18n]);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("lang", lng);
    };

    return (
        <div>
            <Select onValueChange={changeLanguage} defaultValue={i18n.language}>
                <SelectTrigger className="border-none focus:ring-0 text-black">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className={'w-auto min-w-fit'} >
                    <SelectItem value="en">
                        <div className="flex items-center gap-2">
                            <img
                                src={enLogo.src}
                                alt="EN Logo"
                                className="h-5 w-5 rounded-full"
                            />
                            <span className="text-md font-semibold">EN</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="mm">
                        <div className="flex items-center gap-2">
                            <img
                                src={mmLogo.src}
                                alt="MM Logo"
                                className="h-5 w-5 rounded-full"
                            />
                            <span className="text-md font-semibold">MM</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default LanguageSwitcher;
