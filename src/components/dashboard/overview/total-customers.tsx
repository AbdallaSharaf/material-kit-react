'use client';

import * as React from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { CircularProgress } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

export interface TotalCustomersProps {
  sx?: SxProps;
}

export function TotalCustomers({ sx }: TotalCustomersProps): React.JSX.Element {
  const t = useTranslations('common');
  const [data, setData] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const today = dayjs();
        const tomorrow = today.add(1, 'day');

        const response = await axiosInstance.post(`https://fruits-heaven-api.onrender.com/api/v1/order/newCustomers`, {
          startDate: today.format('YYYY-MM-DD'),
          endDate: tomorrow.format('YYYY-MM-DD'),
        });
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);
  if (loading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
      </Stack>
    );
  }
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                {t('New Customers')}
              </Typography>
              <Typography variant="h4">{data?.length}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-success-main)', height: '56px', width: '56px' }}>
              <UsersIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
