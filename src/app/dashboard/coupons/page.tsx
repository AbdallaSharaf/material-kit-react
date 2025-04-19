import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Button } from '@mui/material';
import Link from 'next/link';
import { CouponsTable } from '@/components/dashboard/coupons/coupons-table';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

export const metadata: Metadata = {
  title: `Coupons | Dashboard | ${config.site.name}`,
};

export default function Page(): React.JSX.Element {
  const t = useTranslations("common");
  // Define a flip class based on the dir

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">{t("Coupons")}</Typography>
          <Link href="coupons/add" passHref>
            <Button variant="contained" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Text */}
              <span>{t("Add")}</span>
              {/* Icon */}
              <PlusIcon style={{ fontSize: 'var(--icon-fontSize-md)'}} />
            </Button>
          </Link>
        </div>
      </Stack>

      <CouponsTable />
    </Stack>
  );
}
