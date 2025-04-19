import * as React from 'react';
import { CategoriesTable } from '@/components/dashboard/categories/categories-table';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';
import { config } from '@/config';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
  title: `Categories | Dashboard | ${config.site.name}`,
};

export default function Page(): React.JSX.Element {
  const t = useTranslations("common");

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">{t("Categories")}</Typography>
          <Link href="categories/add" passHref>
            <Button
              variant="contained"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {t("Add")}
              <PlusIcon fontSize="var(--icon-fontSize-md)" />
            </Button>
          </Link>
        </div>
      </Stack>

      <CategoriesTable />
    </Stack>
  );
}
