import React from 'react';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { getLocale, getTranslations } from 'next-intl/server';

import CategoryForm from '@/components/dashboard/categories/category-form';

interface PageProps {
  params: { id: string };
}

const getCategoryById = async (id: string) => {
  try {
    const res = await fetch(`https://fruits-heaven-api.onrender.com/api/v1/category/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch category: ${res.status}`);

    const data = await res.json();
    return data.Category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
};

const categoryPage = async ({ params }: PageProps) => {
  const t = await getTranslations('common');
  const locale = await getLocale();
  const { id } = params;

  if (!id) throw new Error('No category ID provided');

  const category = await getCategoryById(id);

  if (!category) {
    return (
      <Stack spacing={3}>
        <Typography variant="h4">{t('Category Not Found')}</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div className="flex w-full justify-between items-center">
          <Typography variant="h4">{`${t('Edit')} ${category.name[locale]}`}</Typography>
        </div>
      </Stack>

      <CategoryForm category={category} />
    </Stack>
  );
};

export default categoryPage;
