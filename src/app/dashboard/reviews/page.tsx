import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


import { config } from '@/config';
import { ReviewsTable } from '@/components/dashboard/reviews/reviews-table';
import { getTranslations } from 'next-intl/server';

export const metadata = { title: `Reviews | Dashboard | ${config.site.name}` } satisfies Metadata;


export default async function Page() {
  const t = await getTranslations('common');

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">{t("Reviews")}</Typography>
        </Stack>
      </Stack>
      <ReviewsTable
      />
    </Stack>
  );
}
