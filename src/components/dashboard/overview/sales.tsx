'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';
import { useTranslations } from 'next-intl';
import axiosInstance from '@/utils/axiosInstance';
import { CircularProgress } from '@mui/material';
import { Stack } from '@mui/system';

export interface SalesProps {
  sx?: SxProps;
}

export function Sales({ sx }: SalesProps): React.JSX.Element {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('common');
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const chartOptions = useChartOptions();

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `https://fruits-heaven-api.vercel.app/api/v1/order/monthlyComparison`,
        { year: currentYear }
      );
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReportData();
  }, []);

  console.log(data)
  // Transform API data to chart series format
  const chartSeries = React.useMemo(() => {
    // Initialize an array with 12 months (0-11) and default sales of 0
    const monthlySales = Array(12).fill(0);
  
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item?.month != null && item?.totalSales != null) {
          // month is 1-12 in API, we convert to 0-11 for array index
          monthlySales[item.month - 1] = item.totalSales;
        }
      });
    }
  
    return [
      {
        name: 'Sales',
        data: monthlySales.map((sales) => Number((sales / 1000).toFixed(2))),
      },
    ];
  }, [data]);

  if (loading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button 
            color="inherit" 
            size="small" 
            startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}
            onClick={fetchReportData}
            disabled={loading}
          >
            {t('sync')}
          </Button>
        }
        title={t('sales')}
      />
      <CardContent>
        <Chart height={350} options={chartOptions} series={chartSeries} type="bar" width="100%" />
      </CardContent>
      {/* <Divider /> */}
    </Card>
  );
}

function useChartOptions(): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
    plotOptions: { bar: { columnWidth: '40px' } },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${value}K` : `${value}`),
        offsetX: -10,
        style: { colors: theme.palette.text.secondary },
      },
    },
  };
}