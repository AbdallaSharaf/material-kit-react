'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

import { createTheme } from '@/styles/theme/create-theme';
import { createTheme as createMuiTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';

import EmotionCache from './emotion-cache';
import { useLocale } from 'next-intl';
import { arSA, enUS } from "@mui/material/locale";

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): React.JSX.Element {
  const cssTheme = createTheme();
  const locale = useLocale();
  const lang = locale === 'ar' ? arSA : enUS;
  return (
    <EmotionCache options={{ key: 'mui' }}>
      <CssVarsProvider theme={cssTheme}>
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </EmotionCache>
  );
}
