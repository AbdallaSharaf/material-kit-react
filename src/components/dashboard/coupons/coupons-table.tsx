"use client"
import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';
import { IconButton, Paper, Switch, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { useCouponHandlers } from '@/controllers/couponsController';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CouponIn } from '@/interfaces/couponInterface';


export function CouponsTable(): React.JSX.Element {
  const { fetchData, handleDelete, handleChangeStatus, fetchOptions } = useCouponHandlers();
  const { refreshData: refreshDataCoupons, activeCoupons, loading } = useSelector(
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
          header: 'Code',
          size: 140,
          enableColumnActions: true,
          grow: true,
          enableColumnFilter: true,
        },
        { 
          accessorKey: 'validFor',
          header: 'Valid For',
          size: 140,
          filterVariant: "select",
          filterSelectOptions: ["all", "shipping", 'category', 'product'],
          enableColumnActions: true,
          enableSorting: false,
          enableColumnFilter: true,
        },
        { 
          accessorKey: 'appliedOn',
          header: 'Applied On',
          size: 180,
          Cell: ({ row }) => {
            const appliedOnIds = row.original.appliedOn;
            const validFor = row.original.validFor;
            const appliedNames = appliedOnIds.map(id => {
              if (validFor === 'category') {
                const category = categories.find(cat => cat._id === id);
                return category ? category.name.en ?? category.name.ar : '';
              } else if (validFor === 'product') {
                const product = products.find(prod => prod._id === id);
                return product ? product.name.en ?? product.name.ar : '';
              }
              return '';
            });
            return appliedNames.join(', ');
          },
          enableColumnActions: true,
          enableColumnFilter: true,
          filterVariant: 'select',
          filterSelectOptions: [
            ...categories.map(cat => ({ value: cat._id, label: cat.name.en ?? cat.name.ar })),
            ...products.map(prod => ({ value: prod._id, label: prod.name.en ?? prod.name.ar })),
          ],
        },
      
        // Status & Limits
        {
          accessorKey: 'isActive',
          header: 'Status',
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
          header: 'User-specific limit / Total limit',
          size: 140,
          Header: () => (
            <Tooltip title="User-specific limit / Total limit ">
              <span>Limits</span>
            </Tooltip>
          ),
          Cell: ({ row }) => {
            const limit = row.original.limit;
            const userLimit = row.original.userLimit;
            return `${limit ? limit : 'N/A'} / ${userLimit ? userLimit : 'N/A'}`;
          },
          enableColumnActions: false,
          enableSorting: false,
          enableColumnFilter: false,
        },
      
        // Financials
        {
          accessorKey: 'amountRange',
          header: 'Amount Range',
          size: 140,
          Cell: ({ row }) => {
            const minAmount = row.original.minAmount;
            const maxAmount = row.original.maxAmount;
      
            if (minAmount && maxAmount) {
              return `$${Number(minAmount).toFixed(2)} - $${Number(maxAmount).toFixed(2)}`;
            }
            if (minAmount) {
              return `$${Number(minAmount).toFixed(2)}+`;
            }
            if (maxAmount) {
              return `Up to $${Number(maxAmount).toFixed(2)}`;
            }
            return 'N/A';
          },
          enableColumnActions: false,
          enableSorting: false,
          enableColumnFilter: false,
        },
      
        // Count & Discount
        {
          accessorKey: 'count',
          header: 'Count',
          size: 90,
          Cell: ({ row }) => row.original.count || 0,
          enableColumnActions: false,
          enableSorting: false,
          enableColumnFilter: false,
        },
        {
          accessorKey: 'discount',
          header: 'Discount',
          size: 100,
          Cell: ({ row }) => {
            const discount = row.original.discount;
            const type = row.original.type;
      
            if (type === 'percentage') {
              return discount ? `${discount}%` : 'N/A';
            } else if (type === 'fixed') {
              return discount ? `SAR ${discount.toFixed(2)}` : 'N/A';
            }
      
            return 'N/A'; // Default case
          },
          enableColumnActions: false,
          enableSorting: false,
          enableColumnFilter: false,
        }
      ];
      
  React.useEffect(() => {
    fetchData(true);
  }, [refreshDataCoupons]);

  const router = useRouter();
  
  React.useEffect(() => {  
    fetchOptions()
  }, [refreshDataCategories, refreshDataProducts]);

  return (
    <Paper>
      <MaterialReactTable
        columns={columns}
        data={activeCoupons}
        enableRowActions
        enableColumnResizing
        enableGlobalFilter={false}
        enableSorting={true}
        columnFilterDisplayMode='popover'
        positionActionsColumn="last"
        state={{ isLoading: loading }}
        getRowId={(row) => row._id}
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: '4px' }}>
            <Tooltip title="Edit">
              <IconButton onClick={(e) => { e.stopPropagation(); router.push(`coupons/edit/${row.original._id}`); }}>
                <i className="fa fa-pencil !text-sm text-yellow-500 hover:text-yellow-600 cursor-pointer"></i>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={(e) => { e.stopPropagation(); handleDelete(row.original); }}>
                <i className="fa fa-trash !text-sm text-red-500 hover:text-red-600 cursor-pointer"></i>
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
    </Paper>
  );
}
