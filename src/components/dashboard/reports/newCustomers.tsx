// components/reports/NewCustomersReportView.tsx
import { Stack, Typography, Divider } from '@mui/material';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';

const NewCustomersReportView = ({ data }: any) => {
  const t = useTranslations('common');

  return (
    <Stack spacing={2}>
      {data.map((customer: any, idx: any) => (
        <Stack key={customer._id || idx} spacing={0.5}>
          <Typography>
            <strong>{t('customerName')}:</strong> {customer.name || t('unknownCustomer')}
          </Typography>
          <Typography>
            <strong>{t('Phone')}:</strong> {customer.phone || t('unknownPhone')}
          </Typography>
          <Typography>
            <strong>{t('firstOrderDate')}:</strong>{' '}
            {dayjs(customer.firstOrderDate).format('YYYY-MM-DD HH:mm')}
          </Typography>
          <Typography>
            <strong>{t('source')}:</strong> {customer.source}
          </Typography>
          <Divider />
        </Stack>
      ))}
    </Stack>
  );
};

export default NewCustomersReportView;
