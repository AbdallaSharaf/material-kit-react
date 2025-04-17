import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import ReduxProvider from '@/redux/store/provider';
import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps){
  const messages = useMessages();
  const locale = useLocale();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
        <LocalizationProvider>
          <UserProvider>
            <ThemeProvider>
              <ReduxProvider>
                {children}
              </ReduxProvider>
              </ThemeProvider>
          </UserProvider>
        </LocalizationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
