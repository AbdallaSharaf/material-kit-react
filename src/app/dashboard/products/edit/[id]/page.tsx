import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import ProductForm from '@/components/dashboard/products/product-form';

interface PageProps {
  params: { id: string };
}

const getProductById = async (id: string) => {
  try {
    console.log("Fetching product with ID:", id);
    const res = await fetch(`https://fruits-heaven-api.vercel.app/api/v1/product/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);

    const data = await res.json();
    const product = data.Product;
    console.log("Fetched product data:", data);
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = params;
  
  if (!id) throw new Error("No product ID provided");

  const product = await getProductById(id);

  if (!product) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4">Product Not Found</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">
            {product && `Edit ${product.name["en"]}`}
          </Typography>
        </div>
      </Stack>

      {product && <ProductForm product={product} />}
    </Stack>
  );
};

