import { Stack, Typography, Divider } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';


const LowestSellingReportView = ({ data }: any) => {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <Stack spacing={2}>
      <Typography variant="h6">
        {t('lowestSellingProducts')}
      </Typography>
      {data.map((product: any, idx: any) => (
        <Stack key={product._id || idx} spacing={0.5}>
          <Typography>
            <strong>{t('productName')}:</strong> {product.name?.[locale] || t('unknownProduct')}
          </Typography>
          <Typography>
            <strong>{t('quantitySold')}:</strong> {product.totalQuantitySold}
          </Typography>
          <Divider />
        </Stack>
      ))}
    </Stack>
  );
};

export default LowestSellingReportView;