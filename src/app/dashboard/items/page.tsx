"use server"

import * as React from 'react';
import { items, ItemsTable } from '@/components/dashboard/items/items-table';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


import { config } from '@/config';

export const metadata = {
  title: `Items | Dashboard | ${config.site.name}`,
} satisfies Metadata;


export default async function Page() {
  
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">Items</Typography>
        </div>
      </Stack>

      <ItemsTable data={items} />

    </Stack>
  );
}
