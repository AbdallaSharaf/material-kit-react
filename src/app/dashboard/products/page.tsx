import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { config } from '@/config';
import dayjs from 'dayjs';

export const metadata = { title: `Products | Dashboard | ${config.site.name}` } satisfies Metadata;
export const products = [
    {
      id: 'PRD-005',
      name: 'Soja & Co. Eucalyptus',
      image: '/assets/product-5.png',
      price: 150, // Price in SAR
      updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
    },
    {
      id: 'PRD-004',
      name: 'Necessaire Body Lotion',
      image: '/assets/product-4.png',
      price: 120,
      updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),
    },
    {
      id: 'PRD-003',
      name: 'Ritual of Sakura',
      image: '/assets/product-3.png',
      price: 200,
      updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),
    },
    {
      id: 'PRD-002',
      name: 'Lancome Rouge',
      image: '/assets/product-2.png',
      price: 180,
      updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),
    },
    {
      id: 'PRD-001',
      name: 'Erbology Aloe Vera',
      image: '/assets/product-1.png',
      price: 250,
      updatedAt: dayjs().subtract(10, 'minutes').toDate(),
    },
  ];
  

export default function Page(): React.JSX.Element {

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
        </Stack>
      </Stack>
      {/* <OrdersTable
        data={orders}
      /> */}
    </Stack>
  );
}
