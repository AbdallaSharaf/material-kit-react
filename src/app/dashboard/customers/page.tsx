import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


import { config } from '@/config';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { useTranslations } from 'next-intl';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;


export default function Page(): React.JSX.Element {
  const t = useTranslations('common');
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">{t("Customers")}</Typography>
        </Stack>
      </Stack>
      <CustomersTable
      />
    </Stack>
  );
}
