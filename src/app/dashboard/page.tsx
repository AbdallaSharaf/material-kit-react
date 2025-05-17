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
  
  return (
    <Grid container spacing={3}>
      {/* <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid> */}
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers sx={{ height: '100%' }}/>
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={8} xs={12}>
        <Sales
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
