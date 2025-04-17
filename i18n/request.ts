import {getRequestConfig} from "next-intl/server";
import {cookies} from "next/headers";

export default getRequestConfig(
    () => {
        const cookieLocale = (cookies().get('MYNEXTAPP_LOCALE'))?.value || "ar"
        const locale = cookieLocale

        const messages = require(`../messages/${locale}.json`);

        return {
            locale,
            messages,
        };
    }
);