import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../public/locales/en/common.json"
import mm from "../public/locales/mm/common.json";

i18next.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        mm: { translation: mm },
    },
    lng: "en", // default
    fallbackLng: "en",
    interpolation: { escapeValue: false },
});

export default i18next;


