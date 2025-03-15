import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


import { config } from '@/config';
import { ReviewsTable } from '@/components/dashboard/reviews/reviews-table';
import type { Review } from '@/components/dashboard/reviews/reviews-table';

export const metadata = { title: `Reviews | Dashboard | ${config.site.name}` } satisfies Metadata;

const reviews: Review[] = [
    {
      id: 'REV-010',
      name: 'Alcides Antonio',
      phone: '908-691-3242',
      date: '2024-03-10',
      status: true,
      rating: '4',
      type: 'store',
      content: 'Great experience, very professional and friendly.',
    },
    {
      id: 'REV-009',
      name: 'Marcus Finn',
      phone: '415-907-2647',
      date: '2024-03-09',
      status: false,
      rating: '3',
      type: 'product',
      content: 'Good service but the waiting time was long.',
    },
    {
      id: 'REV-008',
      name: 'Jie Yan',
      phone: '770-635-2682',
      date: '2024-03-08',
      status: true,
      rating: '5',
      type: 'store',
      content: 'Excellent service! Highly recommend.',
    },
    {
      id: 'REV-007',
      name: 'Nasimiyu Danai',
      phone: '801-301-7894',
      date: '2024-03-07',
      status: true,
      rating: '2',
      type: 'product',
      content: 'Not satisfied with the quality of service.',
    },
    {
      id: 'REV-006',
      name: 'Iulia Albu',
      phone: '313-812-8947',
      date: '2024-03-06',
      status: false,
      rating: '4',
      type: 'store',
      content: 'Friendly staff and clean environment.',
    },
    {
      id: 'REV-005',
      name: 'Fran Perez',
      phone: '712-351-5711',
      date: '2024-03-05',
      status: true,
      rating: '3',
      type: 'product',
      content: 'Average experience, nothing special.',
    },
    {
      id: 'REV-004',
      name: 'Penjani Inyene',
      phone: '858-602-3409',
      date: '2024-03-04',
      status: false,
      rating: '1',
      type: 'store',
      content: 'Terrible experience. Will not come back.',
    },
    {
      id: 'REV-003',
      name: 'Carson Darrin',
      phone: '304-428-3097',
      date: '2024-03-03',
      status: true,
      rating: '5',
      type: 'product',
      content: 'Best service I have ever received!',
    },
    {
      id: 'REV-002',
      name: 'Siegbert Gottfried',
      phone: '702-661-1654',
      date: '2024-03-02',
      status: true,
      rating: '4',
      type: 'store',
      content: 'Very professional and efficient.',
    },
    {
      id: 'REV-001',
      name: 'Miron Vitold',
      phone: '972-333-4106',
      date: '2024-03-01',
      status: false,
      rating: '2',
      type: 'product',
      content: 'Not impressed with the service.',
    },
  ];
  

export default function Page(): React.JSX.Element {

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Reviews</Typography>
        </Stack>
      </Stack>
      <ReviewsTable
        data={reviews}
      />
    </Stack>
  );
}
