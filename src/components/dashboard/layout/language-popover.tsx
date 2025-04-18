"use client";
import { Popover, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import CheckIcon from '@mui/icons-material/Check';

export interface UserPopoverProps {
  anchorEl: Element | undefined;
  onClose: () => void;
  open: boolean;
}

const FlagIcon = ({ code }: { code: string }) => (
  <img
    src={`https://flagsapi.com/${code}/flat/24.png`}
    alt={code}
    style={{ width: 24, height: 16, borderRadius: 2 }}
  />
);

export default function LanguagePopover({
  anchorEl,
  onClose,
  open,
}: UserPopoverProps): React.JSX.Element {
  const [locale, setLocale] = React.useState('ar');
  const router = useRouter();

  const isSelected = (lang: string) => locale === lang;

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

  const handleLocaleChange = (newLocale: string) => {
    if (locale !== newLocale) {
      setLocale(newLocale);
      document.cookie = `MYNEXTAPP_LOCALE=${newLocale}; path=/;`;
      router.refresh();
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '160px' } } }}
    >
      <Box sx={{ p: 2, minWidth: '150px' }}>
        <Stack direction="column" spacing={2}>
          {[
            { code: 'EG', label: 'العربية', value: 'ar' },
            { code: 'US', label: 'English', value: 'en' },
          ].map(({ code, label, value }) => (
            <Stack
              key={value}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
              sx={{
                cursor: 'pointer',
                backgroundColor: isSelected(value)
                  ? 'primary.main'
                  : 'transparent',
                color: isSelected(value) ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: isSelected(value)
                    ? 'primary.dark'
                    : 'action.hover',
                },
                px: 1.5,
                py: 0.75,
                borderRadius: 1,
              }}
              onClick={() => {
                handleLocaleChange(value);
                onClose();
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <FlagIcon code={code} />
                <Typography
                  variant="button"
                  sx={{ fontWeight: isSelected(value) ? 600 : 400 }}
                >
                  {label}
                </Typography>
              </Stack>
              {isSelected(value) && <CheckIcon fontSize="small" />}
            </Stack>
          ))}
        </Stack>
      </Box>
    </Popover>
  );
}
