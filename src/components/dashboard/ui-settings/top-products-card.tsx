'use client';

import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { useProductHandlers } from '@/controllers/productsController';
import {
  Stack,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Paper,
  Divider,
  Box,
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useLocale, useTranslations } from 'next-intl';

export function TopProductsCard(): React.JSX.Element {
  const { topProducts, refreshData, loading} = useSelector((state: RootState) => state.products);
  const { fetchTopProductData, handleMarkTopProduct, handleUpdateProduct } = useProductHandlers();
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("common");
  const [sku, setSku] = React.useState('');

  React.useEffect(() => {
    fetchTopProductData();
  }, [refreshData]);

  const handleAddTopProduct = async () => {
    if (!sku.trim()) return;
    handleMarkTopProduct(sku);
    setSku('');
  };

  const handleRemoveTopProduct = async (productId: string) => {
    handleUpdateProduct({ id: productId, values: { isTopProduct: false } });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6" fontWeight={600}>
          {t("Top Products in UI")}
        </Typography>

        <Stack direction="row" spacing={2}>
          <TextField
            label={t("Enter Product SKU")}
            variant="outlined"
            size="small"
            fullWidth
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddTopProduct} disabled={loading}>
            {t("Add")}
          </Button>
        </Stack>

        {topProducts?.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {t("No top products found")}
          </Typography>
        ) : (
          <List sx={{ width: '100%' }}>
            {topProducts.map((product, index) => (
              <React.Fragment key={product._id}>
                <ListItem
                  sx={{
                    px: 1,
                    py: 1,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => handleRemoveTopProduct(product._id)}
                      disabled={loading}
                    >
                      <RemoveCircleIcon color="error" />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={product.images?.[0]}
                      alt={product.name?.[locale] ?? 'Product'}
                      sx={{ width: 56, height: 56 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    className='pl-3'
                    primary={product.name?.[locale]}
                    secondary={`${t("SKU")}: ${product.SKU ?? 'N/A'}`}
                  />
                </ListItem>
                {index < topProducts.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Stack>
    </Paper>
  );
}
