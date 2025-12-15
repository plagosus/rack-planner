import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Custom plugin to inject Google Analytics
const htmlPlugin = (mode: string): Plugin => {
    const env = loadEnv(mode, process.cwd());
    const gaId = env.VITE_GOOGLE_ANALYTICS_ID;

    return {
        name: 'html-transform',
        transformIndexHtml(html) {
            if (!gaId) return html;

            return {
                html,
                tags: [
                    {
                        tag: 'script',
                        attrs: {
                            async: true,
                            src: `https://www.googletagmanager.com/gtag/js?id=${gaId}`,
                        },
                        injectTo: 'head',
                    },
                    {
                        tag: 'script',
                        children: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `,
                        injectTo: 'head',
                    },
                ],
            };
        },
    };
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react(), htmlPlugin(mode)],
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
}));
