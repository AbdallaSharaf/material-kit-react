'use client';

import React, { useEffect, useState } from 'react';
import { Stack, Typography, Paper } from '@mui/material';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Button } from '@mui/material';
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


  const handleDownloadPDF = () => {
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/pdf' }); // content is still plain text
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportKey}-report.pdf`; // name it however you like
    a.click();
  
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchReportData = async () => {
        try {
          const [from, to] = dateRange;
      
          const response = await axios.post(`https://fruits-heaven-api.vercel.app/api/v1/order/${reportKey}`,
            {
              startDate: dayjs(from).format("YYYY-MM-DD"),
              endDate: dayjs(to).format("YYYY-MM-DD"),
            }
          );
          console.log(response.data)
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
        <div className='flex justify-between'>
        <DateRangePicker
          value={dateRange}
          onChange={(range) => setDateRange(range as [Date, Date])}
          cleanable={false}
          format="yyyy-MM-dd"
          />
        <Button
          variant="contained"
          onClick={handleDownloadPDF}
          >
            <FileDownloadIcon />
          {/* {t('Download as PDF')} */}
        </Button>
        </div>

        {/* Render result */}
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
      </Stack>
    </Paper>
  );
};
