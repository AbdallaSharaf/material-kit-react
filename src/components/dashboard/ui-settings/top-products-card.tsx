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
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useLocale, useTranslations } from 'next-intl';
import { ProductIn } from '@/interfaces/productInterface';
import axios from '@/utils/axiosInstance';

export function TopProductsCard(): React.JSX.Element {
  const { topProducts, refreshData, loading} = useSelector((state: RootState) => state.products);
  const { fetchTopProductData, handleMarkTopProduct, handleUpdateProduct } = useProductHandlers();
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("common");
  const [selectedProduct, setSelectedProduct] = React.useState<ProductIn | null>(null);
  
  
  const [options, setOptions] = React.useState([] as ProductIn[]);
  const [inputValue, setInputValue] = React.useState('');
  const [loadingOptions, setLoadingOptions] = React.useState(false);
  
  React.useEffect(() => {
    const fetchOptions = async () => {
      if (!inputValue.trim()) return;
      setLoadingOptions(true);
      try {
        const url = `https://fruits-heaven-api.vercel.app/api/v1/product?keyword=${inputValue}`;
        const res = await axios.get(url);
        const data = res.data;
        setOptions(data.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const delayDebounce = setTimeout(fetchOptions, 400); // debounce input
  return () => clearTimeout(delayDebounce);
}, [inputValue]);

  React.useEffect(() => {
    fetchTopProductData();
  }, [refreshData]);

  const handleAddTopProduct = async () => {
    if (!selectedProduct?.SKU) return;
    handleMarkTopProduct(selectedProduct);
    setInputValue('');
    setSelectedProduct(null);
    setOptions([]);
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
        <Autocomplete
          fullWidth
          options={options}
          getOptionLabel={(option) => `${option.name?.[locale] ?? ''} (${option.SKU ?? ''})`}
          loading={loadingOptions}
          inputValue={inputValue}
          onInputChange={(_, value) => setInputValue(value)}
          onChange={(_, value) => setSelectedProduct(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("Enter Product SKU")}
              variant="outlined"
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingOptions && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
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
