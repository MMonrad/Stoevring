import i18next from "i18next";
import * as LanguageDetector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";
import * as resources from "src/locales";

i18next.use(LanguageDetector)
       .use(reactI18nextModule)
       .init({
           interpolation: {
                escapeValue: false
           },
           fallbackLng: 'da-DK',
           resources
       })

export default i18next;
