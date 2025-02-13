import dayjs from 'dayjs';
import { Product, products, ProductsTable } from '@/components/dashboard/products/products-table';
import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


import { config } from '@/config';


export const metaData = {
  title: `Products | Dashboard | ${config.site.name}`,
} satisfies Metadata;


export default function Page(): React.JSX.Element {
  
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">Products</Typography>
        </div>
      </Stack>

      <ProductsTable data={products} />

    </Stack>
  );
}
