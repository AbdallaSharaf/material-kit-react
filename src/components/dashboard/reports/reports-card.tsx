'use client';

import React, { useEffect, useState } from 'react';
import { Stack, Typography, Paper } from '@mui/material';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import axios from '@/utils/axiosInstance';

interface ReportsProps {
  reportKey: string;
  title: string;
}

export const ReportsCard = ({ reportKey, title }: ReportsProps) => {
  const t = useTranslations("common");

  const [dateRange, setDateRange] = useState<[Date, Date]>(() => {
    const end = new Date();
    const start = dayjs(end).subtract(1, 'month').toDate();
    return [start, end];
  });

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchReportData = async () => {
        try {
          const [from, to] = dateRange;
      
          const response = await axios.get(`/order/${reportKey}`, {
            params: {
              startDate: dayjs(from).format("YYYY-MM-DD"),
              endDate: dayjs(to).format("YYYY-MM-DD"),
            },
          });
      
          setData(response.data.data); // assuming the response shape is { data: [...] }
        } catch (error) {
          console.error('Error fetching report:', error);
        }
      };

    fetchReportData();
  }, [reportKey, dateRange]);

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">{title}</Typography>

        <DateRangePicker
          value={dateRange}
          onChange={(range) => setDateRange(range as [Date, Date])}
          cleanable={false}
          format="yyyy-MM-dd"
        />

        {/* Render result */}
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
      </Stack>
    </Paper>
  );
};
