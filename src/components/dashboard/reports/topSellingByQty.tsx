// components/reports/TopSellingProductsReportView.tsx
import { Stack, Typography, Divider } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

const TopSellingProductsReportView = ({ data, type }: any) => {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <Stack spacing={2}>
      {data.map((product: any, idx: any) => (
        <Stack key={product._id || idx} spacing={0.5}>
          <Typography>
            <strong>{t('productName')}:</strong>{' '}
            {product.name?.[locale] || t('unknownProduct')}
          </Typography>
          <Typography>
            <strong>
              {type === 'topSellingByQty'
                ? t('totalQuantitySold')
                : t('totalRevenue')}
              :
            </strong>{' '}
            {type === 'topSellingByQty'
              ? product.totalQuantitySold
              : `\$${product.totalRevenue?.toFixed(2)}`}
          </Typography>
          <Divider />
        </Stack>
      ))}
    </Stack>
  );
};

export default TopSellingProductsReportView;
