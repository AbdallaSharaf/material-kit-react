// components/reports/HighValueCustomersReportView.tsx
import { Stack, Typography, Divider } from '@mui/material';
import { useTranslations } from 'next-intl';

const HighValueCustomersReportView = ({ data }: any) => {
  const t = useTranslations('common');

  return (
    <Stack spacing={2}>
      {data.map((customer: any, idx: any) => (
        <Stack key={customer._id || idx} spacing={0.5}>
          <Typography>
            <strong>{t('customerName')}:</strong> {customer.name || t('unknownCustomer')}
          </Typography>
          <Typography>
            <strong>{t('totalSpent')}:</strong> ${customer.totalSpent?.toFixed(2) || 0}
          </Typography>
          <Divider />
        </Stack>
      ))}
    </Stack>
  );
};

export default HighValueCustomersReportView;
