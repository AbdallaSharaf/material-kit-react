import React from 'react';
import { OrderIn } from '@/interfaces/orderInterface';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { download, generateCsv, mkConfig } from 'export-to-csv'; //or use your library of choice here

import { MRT_Row } from 'material-react-table';
import { useTranslations } from 'next-intl';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

export default function CustomToolbar({ table, data }: any) {
  const t = useTranslations('common');
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

  const handleExportData = () => {
    if (!data || data.length === 0) return;

    const rowData = data.map((order: OrderIn) => ({
      OrderID: order._id,
      Customer: order.shippingAddress.name,
      Email: order.shippingAddress.email,
      Phone: order.shippingAddress.phone,
      City: order.shippingAddress.city,
      Country: order.shippingAddress.country,
      Date: dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      Status: order.status,
      PaymentMethod: order.paymentMethod,
      PaymentStatus: order.isPaid ? t('Paid') : t('Unpaid'),
      DeliveryStatus: order.isDelivered ? t('Delivered') : t('Pending'),
      Items: order.items.map((item) => `${item.quantity} x ${item?.name?.en || item?.name?.ar || ''}`).join('; '),
      Subtotal: order.subTotal.toFixed(2),
      ShippingFee: order.shippingFee.toFixed(2),
      Total: order.totalPrice.toFixed(2),
      Notes: order.notes || '',
    }));

    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

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
        //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
        onClick={handleExportData}
        startIcon={<FileDownloadIcon />}
      >
        {t("Export All Data")}
      </Button>
      <Button
        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
        //only export selected rows
        onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        startIcon={<FileDownloadIcon />}
      >
        {t('Export Selected Rows')}
      </Button>
    </Box>
  );
}
