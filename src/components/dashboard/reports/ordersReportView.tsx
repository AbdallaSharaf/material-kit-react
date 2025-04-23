// components/reports/OrdersReportView.tsx
import { Stack, Typography, Divider, Pagination, Box } from '@mui/material';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import dayjs from 'dayjs';

const OrdersReportView = ({ data }: any) => {
  const t = useTranslations('common');
  const locale = useLocale();
  const itemsPerPage = 5;

  const [page, setPage] = useState(1);

  const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  return (
    <Stack spacing={3}>
      {paginatedData.map((order: any, idx: number) => (
        <Stack key={order._id || idx} spacing={1}>
          <Typography>
            <strong>{t('customerName')}:</strong> {order.customerName || t('unknownCustomer')}
          </Typography>
          <Typography>
            <strong>{t('totalPrice')}:</strong> ${order.totalPrice?.toFixed(2) || 0}
          </Typography>
          <Typography>
            <strong>{t('paymentMethod')}:</strong> {order.paymentMethod}
          </Typography>
          <Typography>
            <strong>{t('orderDate')}:</strong> {dayjs(order.orderDate).format('YYYY-MM-DD HH:mm')}
          </Typography>

          <Typography>
            <strong>{t('products')}:</strong>
          </Typography>
          <Stack pl={2} spacing={0.5}>
            {order.products.map((product: any, i: number) => (
              <Box key={product._id || i}>
                <Typography>
                  • {product.name?.[locale] || t('unknownProduct')} - {t('quantity')}: {product.quantity} - {t('price')}: ${product.price}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Divider />
        </Stack>
      ))}

      {totalPages > 1 && (
        <Box className="flex flex-nowrap" justifyContent="center">
          <Pagination count={totalPages} page={page} onChange={handlePageChange} siblingCount={0} color="primary" />
        </Box>
      )}
    </Stack>
  );
};

export default OrdersReportView;
