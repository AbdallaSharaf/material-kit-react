import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { orders } from './orders/page';
import dayjs from 'dayjs';
import { CategoryOut } from '@/interfaces/categoryInterface';
export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export interface Product {
  _id: string;
  image: string;
  name: string;
  price: number;
  updatedAt: Date;
  categories: CategoryOut[];
  isPricePerKilo: boolean; // true if the price is per kilogram, false if per piece
  isActive: boolean;
}  


export default function Page(): React.JSX.Element {
  const categoryDummy = {
    name: {
        ar: "بوكسات",
        en: "Boxes"
    },
    description: {
        ar: "وصف بوكسات",
        en: "Boxed products description"
    },
    showInTopMenu: true,
    _id: "67dc6cc098d32ef1f31ebff1",
    slug: "boxes",
    photos: [],
    order: 1,
    available: true,
    deleted: false,
    createdAt: "2025-03-20T19:30:08.661Z",
    updatedAt: "2025-03-20T19:30:08.661Z",
    __v: 0,
  }
  
  const products: Product[] = [
    {
      _id: 'PRD-005',
      name: 'Soja & Co. Eucalyptus',
      image: '/assets/product-5.png',
      price: 150, // Price in SAR
      updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
      categories: [categoryDummy],
      isPricePerKilo: true,
      isActive: true,
    },
    {
      _id: 'PRD-004',
      name: 'Necessaire Body Lotion',
      image: '/assets/product-4.png',
      price: 120,
      updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),
      categories: [categoryDummy],
      isPricePerKilo: false,
      isActive: false,
    },
    {
      _id: 'PRD-003',
      name: 'Ritual of Sakura',
      image: '/assets/product-3.png',
      price: 200,
      updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),
      categories: [categoryDummy],
      isPricePerKilo: true,
      isActive: true,
    },
    {
      _id: 'PRD-002',
      name: 'Lancome Rouge',
      image: '/assets/product-2.png',
      price: 180,
      updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),
      categories: [categoryDummy],
      isPricePerKilo: false,
      isActive: true,
    },
    {
      _id: 'PRD-001',
      name: 'Erbology Aloe Vera',
      image: '/assets/product-1.png',
      price: 250,
      updatedAt: dayjs().subtract(10, 'minutes').toDate(),
      categories: [categoryDummy],
      isPricePerKilo: true,
      isActive: false,
    },
  ];
  
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid>
      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          products={products}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders
          orders={orders}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
