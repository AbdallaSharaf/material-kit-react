'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProductIn } from '@/interfaces/productInterface';
import axiosInstance from '@/utils/axiosInstance';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import type { SxProps } from '@mui/material/styles';
import { Stack } from '@mui/system';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';

export interface LatestProductsProps {
  sx?: SxProps;
}

export function LatestProducts({ sx }: LatestProductsProps): React.JSX.Element {
  const locale = useLocale() as 'en' | 'ar';
  const t = useTranslations('common');
  const router = useRouter();
  const [data, setData] = React.useState<ProductIn[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const url = new URL('https://fruits-heaven-api.onrender.com/api/v1/product');
        url.searchParams.set('deleted', 'false');
        url.searchParams.set('PageCount', '6');
        url.searchParams.set('sort', '-createdAt');
        url.searchParams.set('page', '1');
        const response = await axiosInstance.get(url.href);
        setData(response.data.data);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);
  if (loading) {
    return (
      <Stack alignItems="center" py={4}>
        <CircularProgress />
      </Stack>
    );
  }
  return (
    <Card sx={sx}>
      <CardHeader title={t('Latest products')} />
      <Divider />
      <List>
        {data.map((product, index) => (
          <ListItem divider={index < data.length - 1} key={product._id}>
            <ListItemAvatar>
              {product.imgCover ? (
                <Box component="img" src={product.imgCover} sx={{ borderRadius: 1, height: '48px', width: '48px' }} />
              ) : (
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: 'var(--mui-palette-neutral-200)',
                    height: '48px',
                    width: '48px',
                  }}
                />
              )}
            </ListItemAvatar>
            <ListItemText
              primary={product.name[locale]}
              primaryTypographyProps={{ variant: 'subtitle1' }}
              secondary={`Updated ${dayjs(product.updatedAt).format('MMM D, YYYY')}`}
              secondaryTypographyProps={{ variant: 'body2' }}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          size="small"
          variant="text"
          onClick={() => {
            router.push('/dashboard/products');
          }}
        >
          {t('View all')}
        </Button>
      </CardActions>
    </Card>
  );
}
