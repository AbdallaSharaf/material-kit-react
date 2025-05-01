import React from 'react';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { getLocale, getTranslations } from 'next-intl/server';
import ProductForm from '@/components/dashboard/products/product-form';
import axios from 'axios';
import { ProductIn } from '@/interfaces/productInterface';

// Configure axios instance
const api = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://fruits-heaven-api.onrender.com/api/v1',
  timeout: 5000, // Set a timeout
});


interface ApiResponse {
  Product: ProductIn;
}

interface PageProps {
  params: { id: string };
}

const getProductById = async (id: string): Promise<ProductIn | null> => {
  try {
    const response = await api.get<ApiResponse>(`/product/${id}`);
    console.log(response.data.Product)
    return response.data.Product;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error fetching product:', error.message);
      if (error.response?.status === 404) {
        console.log('Product not found');
      }
    } else {
      console.error('Unexpected error fetching product:', error);
    }
    return null;
  }
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = params;
  if (!id) throw new Error('No product ID provided');

  const product = await getProductById(id);
  const t = await getTranslations('common');
  const locale = await getLocale() as "ar" | "en";

  if (!product) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4">{t('Product Not Found')}</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">
            {product && `${t('Edit')} ${product.name[locale]}`}
          </Typography>
        </div>
      </Stack>

      {product && <ProductForm product={product} />}
    </Stack>
  );
}