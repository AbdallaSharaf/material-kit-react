import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


import { config } from '@/config';
import { OrdersTable } from '@/components/dashboard/orders/orders-table';
import dayjs from 'dayjs';
import { Order } from '@/components/dashboard/orders/orders-table';

export const metadata = { title: `Orders | Dashboard | ${config.site.name}` } satisfies Metadata;

export const orders: Order[] = [
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
  
export default function Page(): React.JSX.Element {

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div style={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Orders</Typography>
          
        </div>
      </Stack>
      <OrdersTable
        data={orders}
      />
    </Stack>
  );
}
