import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import { Language } from "../enums/Language";
import { storage } from "../utils/storage-management";
import enUS from "./resources/en-US";
import viVN from "./resources/vi-VN";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    ns: ["common", "error", "account", "layouts", "components", "views", "pages"],
    defaultNS: "common",
    resources: {
      "vi-VN": viVN,
      "en-US": enUS,
    },
    lng: storage.getLanguage() || Language.VI, // if you're using a language detector, do not define the lng option
    fallbackLng: Language.VI,

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

export default i18n;
