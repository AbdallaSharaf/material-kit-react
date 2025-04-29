'use client';

import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import { Box, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import { ReviewIn } from '@/interfaces/reviewInterface';
import { useReviewHandlers } from '@/controllers/reviewsController';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import { MRT_Localization_AR } from 'material-react-table/locales/ar';
import { MRT_Localization_EN } from 'material-react-table/locales/en';

export function ReviewsTable(): React.JSX.Element {
  const { 
    refreshData,
    reviews,
    loading
  } = useSelector((state: RootState) => state.reviews);

  const t = useTranslations("common");
  const locale = useLocale();
  const {handleUpdateReview, fetchData} = useReviewHandlers();

  // Define columns with translations
  const columns: MRT_ColumnDef<ReviewIn>[] = [
    {
      accessorFn: (row) => row.user?.name,
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorFn: (row) => row.productName,
      accessorKey: 'product',
      header: t('product'),
    },
    {
      accessorFn: (row) => row.user?.phone,
      accessorKey: 'phone',
      header: t('phone'),
    },
    {
      accessorFn: (row) => dayjs(row.createdAt).format('YYYY-MM-DD'),
      accessorKey: 'createdAt',
      header: t('date'),
    },
    {
      accessorKey: 'status',
      header: t('visible'),
      Cell: ({ row }) => (
        <Switch
          checked={!row.original.deleted}
          onChange={() => handleUpdateReview({
            id: row.original._id, 
            values: { deleted: !row.original.deleted }
          })}
          color="primary"
        />
      ),
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorKey: 'rating',
      header: t('rating'),
      Cell: ({ cell }) => (
        <Rating
          value={parseFloat(cell.getValue<string>())}
          precision={0.5}
          readOnly
        />
      ),
    },
  ];

  React.useEffect(() => {
    fetchData();
  }, [refreshData]);

  return (
    <Paper>
      <MaterialReactTable
        columns={columns}
        data={reviews}
        columnFilterDisplayMode="popover"
        positionToolbarAlertBanner="bottom"
        enableColumnActions={false}
        enableColumnResizing
        enableExpandAll={false}
        getRowId={(row) => row._id}
        state={
          {
            isLoading: loading
          }
        }
        columnResizeDirection={locale === 'ar' ? 'rtl' : 'ltr'}
        localization={locale === 'ar' ? MRT_Localization_AR : MRT_Localization_EN}
        enableEditing={false}
        enableRowActions={false}
        layoutMode='grid'
        muiDetailPanelProps= {() => ({
          sx: (theme) => ({
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,210,244,0.1)'
                : 'rgba(0,0,0,0.1)',
          }),
        })}
        renderDetailPanel={({ row }) => (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2">{row.original.comment}</Typography>
          </Box>
        )}
        muiTableHeadCellProps={{
          sx: {
            '& .Mui-TableHeadCell-Content-Wrapper': {
              height: 18,
            },
            '& .Mui-TableHeadCell-Content-Labels': {
              height: 18,
            },
          },
        }}
      />
    </Paper>
  );
}