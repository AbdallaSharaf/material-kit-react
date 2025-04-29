"use client";
import React, { useState, useEffect } from 'react';
import { OrderIn } from '@/interfaces/orderInterface';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MRT_Row } from 'material-react-table';
import { useTranslations } from 'next-intl';
import axiosInstance from '@/utils/axiosInstance';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

export default function CustomToolbar({ table }: { table: any }) {
  const t = useTranslations('common');
  const [isLoading, setIsLoading] = useState(false);
  const [exportAllTrigger, setExportAllTrigger] = useState(false);

  // Keep your existing selected rows export function unchanged
  const handleExportRows = (rows: MRT_Row<OrderIn>[]) => {
    const rowData = rows.map((row) => ({
      OrderID: row.original._id,
      Customer: row.original.shippingAddress.name,
      Email: row.original.shippingAddress.email,
      Phone: row.original.shippingAddress.phone,
      City: row.original.shippingAddress.city,
      Country: row.original.shippingAddress.country,
      Date: dayjs(row.original.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      Status: row.original.status,
      PaymentMethod: row.original.paymentMethod,
      PaymentStatus: row.original.isPaid ? t('Paid') : t('Unpaid'),
      DeliveryStatus: row.original.isDelivered ? t('Delivered') : t('Pending'),
      Items: row.original.items
        .map((item) => `${item.quantity} x ${item?.name?.en || item?.name?.ar || ''}`)
        .join('; '),
      Subtotal: row.original.subTotal.toFixed(2),
      ShippingFee: row.original.shippingFee.toFixed(2),
      Total: row.original.totalPrice.toFixed(2),
      Notes: row.original.notes || '',
    }));

    if (rowData.length > 0) {
      const csv = generateCsv(csvConfig)(rowData);
      download(csvConfig)(csv);
    }
  };

  // Handle the "Export All" click - just set the trigger
  const handleExportAllClick = () => {
    setExportAllTrigger(true);
  };

  // useEffect for handling the actual export when triggered
  useEffect(() => {
    if (!exportAllTrigger) return;

    const exportAllData = async () => {
      setIsLoading(true);
      try {
        // Fetch all orders from your API
        const response = await axiosInstance.get('https://fruits-heaven-api.vercel.app/api/v1/order?PageCount=all');
        const data = response.data;
        console.log(data.data)
        if (!data || !data.data || data.data.length === 0) {
          throw new Error('No data available');
        }
        // Format the data for CSV
        const rowData = data.data.map((order: OrderIn) => ({
          OrderID: order?._id,
          InvoiceID: order?.invoiceId,
          Customer: order?.shippingAddress?.name,
          Email: order?.shippingAddress?.email,
          Phone: order?.shippingAddress?.phone,
          City: order?.shippingAddress?.city,
          Country: order?.shippingAddress?.country,
          Date: dayjs(order?.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          Status: order?.status,
          PaymentMethod: order?.paymentMethod,
          PaymentStatus: order?.isPaid ? t('Paid') : t('Unpaid'),
          DeliveryStatus: order?.isDelivered ? t('Delivered') : t('Pending'),
          Items: order?.items
            .map((item) => `${item?.quantity} x ${item?.name?.en || item?.name?.ar || ''}`)
            .join('; '),
          Subtotal: order?.subTotal.toFixed(2),
          ShippingFee: order?.shippingFee.toFixed(2),
          Total: order?.totalPrice.toFixed(2),
          Notes: order?.notes || '',
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
        <span>
          {isLoading ? t('Loading') : t('Export All Data')}
        </span>
        <FileDownloadIcon style={{ fontSize: 'var(--icon-fontSize-md)' }} />
      </Button>
      <Button
        disabled={
          !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
        }
        onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <span>
          {t('Export Selected Rows')}
        </span>
        <FileDownloadIcon style={{ fontSize: 'var(--icon-fontSize-md)' }} />
      </Button>
    </Box>
  );
}