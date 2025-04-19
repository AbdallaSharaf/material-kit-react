'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

const FlagIcon = ({ code }: { code: string }) => (
  <img
    src={`https://flagsapi.com/${code}/flat/24.png`}
    alt={code}
    style={{ width: 24, height: 16, borderRadius: 2, cursor: 'pointer' }}
  />
);

export default function LanguageToggle(): React.JSX.Element {
  const [locale, setLocale] = React.useState('ar');
  const router = useRouter();

  React.useEffect(() => {
    const cookieLocale = document.cookie
      .split(';')
      .find((row) => row.trim().startsWith('MYNEXTAPP_LOCALE='))?.split('=')[1];

    if (cookieLocale) {
      setLocale(cookieLocale);
    } else {
      const browserLocale = navigator.language.slice(0, 2);
      setLocale(browserLocale);
      document.cookie = `MYNEXTAPP_LOCALE=${browserLocale}; path=/;`;
      router.refresh();
    }
  }, []);

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    setLocale(newLocale);
    document.cookie = `MYNEXTAPP_LOCALE=${newLocale}; path=/;`;
    router.refresh();
  };

  return (
    <div onClick={toggleLocale}>
      <FlagIcon code={locale === 'en' ? 'US' : 'EG'} />
    </div>
  );
}
