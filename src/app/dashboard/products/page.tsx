import * as React from 'react';
import { ProductsTable } from '@/components/dashboard/products/products-table';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { Metadata } from 'next';
import { config } from '@/config';
import TagsModal from '@/components/dashboard/products/tags-modal';

export const metadata: Metadata = {
  title: `Products | Dashboard | ${config.site.name}`,
};

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
            <Typography variant="h4">Products</Typography>
          <TagsModal />
        </div>
      </Stack>

      <ProductsTable />
    </Stack>
  );
}
