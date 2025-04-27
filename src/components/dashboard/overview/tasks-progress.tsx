"use client"
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ListBullets as ListBulletsIcon } from '@phosphor-icons/react/dist/ssr/ListBullets';
import dayjs from 'dayjs';
import axiosInstance from '@/utils/axiosInstance';
import { CircularProgress } from '@mui/material';
import { useTranslations } from 'next-intl';

export interface TasksProgressProps {
  sx?: SxProps;
}

export function TasksProgress({ sx }: TasksProgressProps): React.JSX.Element {
    const t = useTranslations('common');
   const [data, setData] = React.useState<any>();
    const [loading, setLoading] = React.useState<boolean>(false);
     React.useEffect(() => {
        const fetchReportData = async () => {
          setLoading(true);
          try {
            const today = dayjs();
            const tomorrow = today.add(1, 'day');
        
            const response = await axiosInstance.post(
              `https://fruits-heaven-api.vercel.app/api/v1/order/salesReport`,
              {
                startDate: today.format('YYYY-MM-DD'),
                endDate: tomorrow.format('YYYY-MM-DD'),
              }
            );
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
                {t("No of orders")}
              </Typography>
              <Typography variant="h4">{data?.numberOfOrders ?data?.numberOfOrders : 0}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-warning-main)', height: '56px', width: '56px' }}>
              <ListBulletsIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          {/* <div>
            <LinearProgress value={value} variant="determinate" />
          </div> */}
        </Stack>
      </CardContent>
    </Card>
  );
}
