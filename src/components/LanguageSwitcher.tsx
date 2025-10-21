"use client";

import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

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
                <SelectTrigger className="border-input focus:border-primary focus:ring-primary/20 text-black">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className={'w-auto min-w-fit'} >
                    <SelectItem value="en">&#127468;🇧EN</SelectItem>
                    <SelectItem value="mm">&#127474;🇲MM</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default LanguageSwitcher;
