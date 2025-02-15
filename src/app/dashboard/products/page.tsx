'use client'

import * as React from 'react';
import { ProductsTable } from '@/components/dashboard/products/products-table';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">Products</Typography>
        </div>
      </Stack>

      <ProductsTable />
    </Stack>
  );
}
