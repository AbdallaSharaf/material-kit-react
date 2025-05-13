import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { useTranslations } from 'next-intl';
import AccountWrapper from '@/components/dashboard/account/account-wrapper';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const t = useTranslations('common');
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">{t("Account")}</Typography>
      </div>
      <AccountWrapper />
    </Stack>
  );
}
