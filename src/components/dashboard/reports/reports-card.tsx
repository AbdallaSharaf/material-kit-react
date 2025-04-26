"use client"
import React, { useEffect, useState } from 'react';
import {
  Stack,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  MenuItem,
} from '@mui/material';
import * as XLSX from 'xlsx';

import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import dayjs from 'dayjs';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Button } from '@mui/material';
import axios from '@/utils/axiosInstance';

import SalesReportView from './salesReportView';
import TopSellingProductsReportView from './topSellingByQty';
import RepeatedCustomersReportView from './repeatedCustomers';
import NewCustomersReportView from './newCustomers';
import HighValueCustomersReportView from './highValueCustomers';
import OrdersReportView from './ordersReportView';
import MonthlyComparisonReportView from './monthlyComparison';
import Swal from 'sweetalert2';
import { handleDownloadExcel } from '@/utils/generateExcel';

interface ReportsProps {
  reportKey: string;
  title: string;
}

export const ReportsCard = ({ reportKey, title }: ReportsProps) => {
  const currentYear = new Date().getFullYear();
  const [dateRange, setDateRange] = useState<[Date, Date]>(() => {
    const end = new Date();
    const start = dayjs(end).subtract(1, 'month').toDate();
    return [start, end];
  });

  const [year, setYear] = useState<number>(currentYear);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        let payload;

        if (reportKey === 'monthlyComparison') {
          payload = { year };
        } else {
          const [from, to] = dateRange;
          payload = {
            startDate: dayjs(from).format('YYYY-MM-DD'),
            endDate: dayjs(to).format('YYYY-MM-DD'),
          };
        }

        const response = await axios.post(
          `https://fruits-heaven-api.vercel.app/api/v1/order/${reportKey}`,
          payload
        );
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportKey, dateRange, year]);

  const renderReportContent = () => {
    if (loading) {
      return (
        <Stack alignItems="center" py={4}>
          <CircularProgress />
        </Stack>
      );
    }

    switch (reportKey) {
      case 'salesReport':
        return <SalesReportView data={data} />;
      case 'topSellingByQty':
      case 'topSellingByRevenue':
        return <TopSellingProductsReportView data={data} type={reportKey} />;
      case 'repeatedCustomers':
        return <RepeatedCustomersReportView data={data} />;
      case 'newCustomers':
        return <NewCustomersReportView data={data} />;
      case 'highValueCustomers':
        return <HighValueCustomersReportView data={data} />;
      case 'ordersAndInvoices':
        return <OrdersReportView data={data} />;
      case 'monthlyComparison':
        return <MonthlyComparisonReportView data={data} />;
      default:
        return <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>;
    }
  };

  const renderPicker = () => {
    if (reportKey === 'monthlyComparison') {
      return (
        <TextField
          select
          label="Select Year"
          value={year}
          size='small'
          onChange={(e) => setYear(Number(e.target.value))}
          sx={{ minWidth: 150 }}
        >
          {Array.from({ length: 10 }, (_, i) => currentYear - i).map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    return (
      <DateRangePicker
        value={dateRange}
        onChange={(range) => setDateRange(range as [Date, Date])}
        cleanable={false}
        format="yyyy-MM-dd"
      />
    );
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">{title}</Typography>
        <div className="flex justify-between items-center gap-4">
          {renderPicker()}
          <Button variant="contained" onClick={() => handleDownloadExcel(data, reportKey, title)}>
            <FileDownloadIcon />
          </Button>
        </div>
        {renderReportContent()}
      </Stack>
    </Paper>
  );
};
