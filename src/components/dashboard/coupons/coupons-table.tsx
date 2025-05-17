"use client"
import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';
import { Button, IconButton, Paper, Switch, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { useCouponHandlers } from '@/controllers/couponsController';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CouponIn } from '@/interfaces/couponInterface';
import { useLocale, useTranslations } from 'next-intl';
import { MRT_Localization_AR } from 'material-react-table/locales/ar';
import { MRT_Localization_EN } from 'material-react-table/locales/en';

export function CouponsTable(): React.JSX.Element {
  const { fetchData, handleDelete, handleChangeStatus, fetchOptions } = useCouponHandlers();
  const [showActive, setShowActive] = React.useState(true);
  const t = useTranslations("common");
  const locale = useLocale() as "en" | "ar"

  const { refreshData: refreshDataCoupons, activeCoupons, expiredCoupons, loading } = useSelector(
    (state: RootState) => state.coupons
  );
  const { refreshData: refreshDataCategories, categories } = useSelector(
    (state: RootState) => state.categories
  );
  const { refreshData: refreshDataProducts, products } = useSelector(
    (state: RootState) => state.products
  );

  const columns: MRT_ColumnDef<CouponIn>[] = [
    // General Information
    { 
      accessorKey: 'code',
      header: t('Code'),
      size: 140,
      enableColumnActions: true,
      grow: true,
      enableColumnFilter: true,
    },
    { 
      accessorKey: 'validFor',
      header: t('Valid For'),
      size: 140,
      filterVariant: "select",
      filterSelectOptions: [
        { value: "all", label: t("All") },
        { value: "shipping", label: t("Shipping") },
        { value: "category", label: t("Category") },
        { value: "product", label: t("Product") },
      ],
      enableColumnActions: true,
      enableSorting: false,
      enableColumnFilter: true,
      Cell: ({ row }) => t(row.original.validFor)
    },
    { 
      accessorKey: 'appliedOn',
      header: t('Applied On'),
      size: 180,
      Cell: ({ row }) => {
        const appliedOnIds = row.original.appliedOn;
        const validFor = row.original.validFor;
        const appliedNames = appliedOnIds.map(id => {
          if (validFor === 'category') {
            const category = categories.find(cat => cat._id === id);
            return category ? category.name[locale] : '';
          } else if (validFor === 'product') {
            const product = products.find(prod => prod._id === id);
            return product ? product.name[locale] : '';
          }
          return '';
        });
        return appliedNames.join(', ');
      },
      enableColumnActions: true,
      enableColumnFilter: true,
      filterVariant: 'select',
      filterSelectOptions: [
        ...categories.map(cat => ({ value: cat._id, label: cat.name[locale] })),
        ...products.map(prod => ({ value: prod._id, label: prod.name[locale] })),
      ],
    },

    // Status & Limits
    {
      accessorKey: 'isActive',
      header: t('Status'),
      size: 90,
      enableColumnActions: false,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Switch
          checked={row.original.isActive === true}
          onChange={() => handleChangeStatus(row.original)}
          color="primary"
        />
      ),
    },

    {
      accessorKey: 'limits',
      header: t('User-specific limit / Total limit'),
      size: 140,
      Header: () => (
        <Tooltip title={t("User-specific limit / Total limit ")}>
          <span>{t("Limits")}</span>
        </Tooltip>
      ),
      Cell: ({ row }) => {
        const limit = row.original.limit;
        const userLimit = row.original.userLimit;
      
        const formatLimit = (val: number | string | undefined) => {
          if (val === 'unlimited') return t('unlimited');
          if (!val) return t('N/A');
          return val;
        };
      
        return `${formatLimit(limit)} / ${formatLimit(userLimit)}`;
      },      
      enableColumnActions: false,
      enableSorting: false,
      enableColumnFilter: false,
    },

    // Financials
{
  accessorKey: 'amountRange',
  header: t('Amount Range'),
  size: 140,
  Cell: ({ row }) => {
    const minAmount = row.original.minAmount;
    const maxAmount = row.original.maxAmount;
    
    const currencyIcon = (
      <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39" width="16" height="16" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}>
        <path fill="#231f20" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/>
        <path fill="#231f20" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/>
      </svg>
    );

    if (minAmount && maxAmount) {
      return (
        <div>
          {currencyIcon}
          {Number(minAmount).toFixed(2)} - {currencyIcon}
          {Number(maxAmount).toFixed(2)}
        </div>
      );
    }
    if (minAmount) {
      return (
        <div>
          {currencyIcon}
          {Number(minAmount).toFixed(2)}+
        </div>
      );
    }
    if (maxAmount) {
      return (
        <div>
          {t('Up to')} {currencyIcon}
          {Number(maxAmount).toFixed(2)}
        </div>
      );
    }
    return t('N/A');
  },
  enableColumnActions: false,
  enableSorting: false,
  enableColumnFilter: false,
},

    // Count & Discount
    {
      accessorKey: 'count',
      header: t('Count'),
      size: 90,
      Cell: ({ row }) => row.original.count || 0,
      enableColumnActions: false,
      enableSorting: false,
      enableColumnFilter: false,
    },
{
  accessorKey: 'discount',
  header: t('Discount'),
  size: 100,
  Cell: ({ row }) => {
    const discount = row.original.discount;
    const type = row.original.type;
    
    const currencyIcon = (
      <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39" width="16" height="16" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}>
        <path fill="#231f20" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/>
        <path fill="#231f20" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/>
      </svg>
    );

    if (type === 'percentage') {
      return discount ? `${discount}%` : t('N/A');
    } else if (type === 'fixed') {
      return (
        <div>
          {discount ? 
            <>
              {currencyIcon}
              {discount.toFixed(2)}
            </> 
            : t('N/A')
          }
        </div>
      );
    }

    return t('N/A'); // Default case
  },
  enableColumnActions: false,
  enableSorting: false,
  enableColumnFilter: false,
}
  ];

  React.useEffect(() => {
    fetchData(true);
    fetchData(false);
  }, [refreshDataCoupons]);

  const router = useRouter();

  React.useEffect(() => {
    fetchOptions()
  }, [refreshDataCategories, refreshDataProducts]);

  return (
    <Paper>
      <MaterialReactTable
        columns={columns}
        data={showActive ? activeCoupons : expiredCoupons}
        enableRowActions
        enableColumnResizing
        enableGlobalFilter={false}
        enableSorting={true}
        columnFilterDisplayMode='popover'
        columnResizeDirection= {locale ==='ar' ? 'rtl' : 'ltr'}
        positionActionsColumn="last"
        state={{ isLoading: loading }}
        getRowId={(row) => row._id}
        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: 'flex', gap: 2, padding: 1 }}>
            <Button
              variant={showActive ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setShowActive(true)}
            >
              {t('Active Coupons')}
            </Button>
            <Button
              variant={!showActive ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => setShowActive(false)}
            >
              {t('Inactive Coupons')}
            </Button>
          </Box>
        )}
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: '4px' }}>
            <Tooltip title={t("Edit")}>
              <IconButton onClick={(e) => { e.stopPropagation(); router.push(`coupons/edit/${row.original._id}`); }}>
                <i className="fa fa-pencil !text-sm text-yellow-500 hover:text-yellow-600 cursor-pointer"></i>
              </IconButton>
            </Tooltip>
            <Tooltip title={t("Delete")}>
              <IconButton color="error" onClick={(e) => { e.stopPropagation(); handleDelete(row.original); }}>
                <i className="fa fa-trash !text-sm text-red-500 hover:text-red-600 cursor-pointer"></i>
              </IconButton>
            </Tooltip>
          </Box>
        )}
        localization={locale === 'ar' ? MRT_Localization_AR : MRT_Localization_EN}
      />
    </Paper>
  );
}
