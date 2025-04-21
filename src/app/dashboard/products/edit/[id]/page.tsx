import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import ProductForm from '@/components/dashboard/products/product-form';
import { getLocale, getTranslations } from 'next-intl/server';

interface PageProps {
  params: { id: string };
}

const getProductById = async (id: string) => {
  try {
    console.log("Fetching product with ID:", id);
    const res = await fetch(`https://fruits-heaven-api.vercel.app/api/v1/product/${id}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      cache: "no-store"
    })

    if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);

    const data = await res.json();
    const product = data.Product;
    console.log("Fetched product data:", product);
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = params;
  console.log(id)
  if (!id) throw new Error("No product ID provided");

  const product = await getProductById(id);
  // const product = await getProductById(id);
  const t = await getTranslations("common")
  const locale = await getLocale()
  console.log(product);
  if (!product) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4">{t("Product Not Found")}</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">
            {product && t("Edit") + " " + product.name[locale]}
          </Typography>
        </div>
      </Stack>
      
      {product && <ProductForm product={product} />}
    </Stack>
  );
};

