import * as React from 'react';
import { ProductsTable } from '@/components/dashboard/products/products-table';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { Metadata } from 'next';
import { config } from '@/config';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Button } from '@mui/material';
import Link from 'next/link';
import { CategoriesTable } from '@/components/dashboard/categories/categories-table';

export const metadata: Metadata = {
  title: `Categories | Dashboard | ${config.site.name}`,
};

export default function Page(): React.JSX.Element {

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
            <Typography variant="h4">Categories</Typography>
            <Link href="categories/add" passHref>
            <Button 
              startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} 
              variant="contained"
            >
              Add
            </Button>
            </Link>
        </div>
      </Stack>

      <CategoriesTable />
    </Stack>
  );
}
