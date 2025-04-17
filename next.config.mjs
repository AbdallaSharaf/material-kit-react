// eslint-disable-next-line @typescript-eslint/no-require-imports
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin()
/** @type {import('next').NextConfig} */
const config = {
    eslint: {
        ignoreDuringBuilds: true, // ✅ Disables ESLint during build
    },
};

export default withNextIntl(config);
