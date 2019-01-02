import * as i18n from "i18next";
import * as LanguageDetector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";
import * as resources from "src/locales";
import { Environment } from "src/utils/environmentVariables";

const environment: string = process.env.SEKOIA_ENV;

if (environment === Environment.local.toString()) {
    i18n.use(reactI18nextModule).init({
        lng: "ss",
        debug: true,
        resources
    });
} else {
    i18n.use(LanguageDetector)
        .use(reactI18nextModule)
        .init({
            debug: false,
            fallbackLng: "en-GB",
            resources
        });
}

export default i18n;
