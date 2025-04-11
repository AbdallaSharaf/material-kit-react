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
  
  const orders = [
    {
      id: 'ORD-007',
      customer: { id: 'CUST-007', name: 'Ekaterina Tankova', phone: '123-456-7890' },
      amount: 30.5,
      shippingStatus: 'pending',
      paymentStatus: 'pending',
      createdAt: dayjs().subtract(10, 'minutes').toDate(),
      notes: 'Urgent order, needs priority processing.', // Optional notes
      items: [
        { id: 'PRD-001', quantity: 2 },
        { id: 'PRD-002', quantity: 1 },
      ],
    },
    {
      id: 'ORD-006',
      customer: { id: 'CUST-006', name: 'Cao Yu', phone: '987-654-3210' },
      amount: 25.1,
      shippingStatus: 'delivered',
      paymentStatus: 'paid',
      createdAt: dayjs().subtract(20, 'minutes').toDate(),
      notes: '', // No notes
      items: [{ id: 'PRD-003', quantity: 1 }],
    },
    {
      id: 'ORD-004',
      customer: { id: 'CUST-004', name: 'Alexa Richardson', phone: '555-123-6789' },
      amount: 10.99,
      shippingStatus: 'returned',
      paymentStatus: 'refunded',
      createdAt: dayjs().subtract(30, 'minutes').toDate(),
      items: [{ id: 'PRD-004', quantity: 3 }],
    },
    {
      id: 'ORD-003',
      customer: { id: 'CUST-003', name: 'Anje Keizer', phone: '321-789-4561' },
      amount: 96.43,
      shippingStatus: 'pending',
      paymentStatus: 'pending',
      createdAt: dayjs().subtract(40, 'minutes').toDate(),
      items: [
        { id: 'PRD-005', quantity: 2 },
        { id: 'PRD-003', quantity: 5 },
      ],
    },
    {
      id: 'ORD-002',
      customer: { id: 'CUST-002', name: 'Clarke Gillebert', phone: '789-456-1230' },
      amount: 32.54,
      shippingStatus: 'delivered',
      paymentStatus: 'paid',
      createdAt: dayjs().subtract(50, 'minutes').toDate(),
      notes: 'Customer requested extra packaging.',
      items: [{ id: 'PRD-004', quantity: 4 }],
    },
    {
      id: 'ORD-001',
      customer: { id: 'CUST-001', name: 'Adam Denisov', phone: '654-321-0987' },
      amount: 16.76,
      shippingStatus: 'delivered',
      paymentStatus: 'paid',
      createdAt: dayjs().subtract(60, 'minutes').toDate(),
      items: [{ id: 'PRD-001', quantity: 1 }],
    },
  ];


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
