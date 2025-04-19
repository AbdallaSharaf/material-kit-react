'use client';

import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';

export function useDirection() {
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const locale = useLocale();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const htmlDir = document?.documentElement?.getAttribute('dir');
      setDir(htmlDir === 'rtl' ? 'rtl' : 'ltr');
    }
  }, [locale]);

  return dir;
}