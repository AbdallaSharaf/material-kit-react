'use client';

import React, { useEffect, useState } from 'react';
import { CustomerIn } from '@/interfaces/customerInterface';
import axiosInstance from '@/utils/axiosInstance';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MRT_Row } from 'material-react-table';
import { useTranslations } from 'next-intl';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

export default function CustomerExportToolbar({ table }: { table: any }) {
  const t = useTranslations('common');
  const [isLoading, setIsLoading] = useState(false);
  const [exportAllTrigger, setExportAllTrigger] = useState(false);

  // Export selected rows
  const handleExportRows = (rows: MRT_Row<CustomerIn>[]) => {
    const rowData = rows.map((row) => ({
      ID: row.original._id,
      Name: row.original.name,
      Email: row.original.email,
      Phone: row.original.phone,
      Country: row.original.address[0]?.country || '',
      City: row.original.address[0]?.city || '',
      Street: row.original.address[0]?.street || '',
      RegistrationDate: dayjs(row.original.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      LastLogin: dayjs(row.original.lastLogin).format('YYYY-MM-DD HH:mm:ss'),
      TotalOrders: row.original.numberOfOrders,
      TotalSpent: row.original.ordersSum.toFixed(2),
    }));

    if (rowData.length > 0) {
      const csv = generateCsv(csvConfig)(rowData);
      download(csvConfig)(csv);
    }
  };

  // Handle the "Export All" click
  const handleExportAllClick = () => {
    setExportAllTrigger(true);
  };

  // useEffect for handling the actual export when triggered
  useEffect(() => {
    if (!exportAllTrigger) return;

    const exportAllData = async () => {
      setIsLoading(true);
      try {
        // Fetch all customers from your API
        const response = await axiosInstance.get('https://fruits-heaven-api.onrender.com/api/v1/user?PageCount=all');
        const data = response.data;
        
        if (!data || !data.data || data.data.length === 0) {
          throw new Error('No data available');
        }
        
        // Format the data for CSV
        const rowData = data.data.map((customer: CustomerIn) => ({
          ID: customer._id,
          Name: customer.name,
          Email: customer.email,
          Phone: customer.phone,
          Country: customer.address[0]?.country || '',
          City: customer.address[0]?.city || '',
          Street: customer.address[0]?.street || '',
          RegistrationDate: dayjs(customer.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          LastLogin: dayjs(customer.lastLogin).format('YYYY-MM-DD HH:mm:ss'),
          TotalOrders: customer.numberOfOrders,
          TotalSpent: customer.ordersSum.toFixed(2),
        }));

        // Generate and download CSV
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
      } catch (error) {
        console.error('Error exporting all data:', error);
        // Optionally show error to user
      } finally {
        setIsLoading(false);
        setExportAllTrigger(false); // Reset the trigger
      }
    };

    exportAllData();
  }, [exportAllTrigger, t]);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        padding: '8px',
        flexWrap: 'wrap',
      }}
    >
      <Button
        onClick={handleExportAllClick}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        disabled={isLoading}
      >
        <span>{isLoading ? t('Loading') : t('Export All Data')}</span>
        <FileDownloadIcon style={{ fontSize: 'var(--icon-fontSize-md)' }} />
      </Button>
      <Button
        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
        onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <span>{t('Export Selected Rows')}</span>
        <FileDownloadIcon style={{ fontSize: 'var(--icon-fontSize-md)' }} />
      </Button>
    </Box>
  );
}