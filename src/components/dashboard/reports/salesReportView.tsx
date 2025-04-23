// components/reports/SalesReportView.tsx
import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';


const SalesReportView = ({ data }: any) => {
  const t = useTranslations("common");

  return (
    <Stack spacing={3}>
      <Typography>
        <strong>{t("numberOfOrders")}:</strong> {data.numberOfOrders}
      </Typography>
      <Typography>
        <strong>{t("totalRevenue")}:</strong> {data.totalRevenue?.toFixed(2)} SAR
      </Typography>
      <Typography>
        <strong>{t("avgOrderValue")}:</strong> {data.avgOrderValue?.toFixed(2)} SAR
      </Typography>
      <Typography>
        <strong>{t("productsSold")}:</strong> {data.productsSold}
      </Typography>
    </Stack>
  );
};

export default SalesReportView;
