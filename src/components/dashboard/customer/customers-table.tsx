'use client';

import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Paper, Switch } from '@mui/material';
import CustomToolbar from './custom-toolbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CustomerIn } from '@/interfaces/customerInterface';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store/store';
import { useCustomerHandlers } from '@/controllers/customersController';
import { useLocale, useTranslations } from 'next-intl';
import { MRT_Localization_AR } from 'material-react-table/locales/ar';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { setColumnFilters, setPagination, setSearchQuery, setSorting } from '@/redux/slices/customerSlice';
import dayjs from 'dayjs';

// Define columns outside the component to avoid defining them during render



export function CustomersTable(): React.JSX.Element {
  const t = useTranslations("common");
  const { fetchData, handleVerifyUserCustomer } = useCustomerHandlers();
  const columns: MRT_ColumnDef<CustomerIn>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
      enableSorting: false,
    },
    {
      accessorKey: 'phone',
      header: t('phone'),
      enableSorting: false,
    },
    {
      accessorKey: 'email',
      header: t('email'),
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: t('registrationDate'),
      Cell: ({ cell }) => dayjs(cell.getValue<string>()).format('YYYY-MM-DD HH:mm'),
      enableColumnFilter: false,
    },
    {
      accessorKey: 'lastLogin',
      header: t('lastLogin'),
      Cell: ({ cell }) => dayjs(cell.getValue<string>()).format('YYYY-MM-DD HH:mm'),
      enableColumnFilter: false,
    },
    {
      accessorKey: 'numberOfOrders',
      header: t('numberOfOrders'),
      enableColumnFilter: false,
    },
    {
      accessorKey: 'ordersSum',
      header: t('totalSpent'),
      enableColumnFilter: false,
      Cell: ({ cell }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {cell.getValue<number>().toFixed(2)}
          <svg 
            id="Layer_1" 
            data-name="Layer 1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1124.14 1256.39" 
            width="16" 
            height="16" 
            style={{ marginLeft: 4 }}
          >
            <path fill="#231f20" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/>
            <path fill="#231f20" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/>
          </svg>
        </div>
      ),
    },
    {
    accessorKey: "verified",
    header: t("Verified"),
    size: 90,
    enableSorting: false,
    enableColumnFilter: false,
    enableEditing: false,
    enableColumnActions: false,
    Cell: ({ row }) => (
      <Switch
      checked={row.original.verified}
      onChange={() => handleVerifyUserCustomer(row.original)}
      color="primary"
      />
    ),
  },
  ];
  
  const { customers, searchQuery, columnFilters, pagination, rowCount, loading, sorting } = useSelector((state: RootState) => state.customers);
  const dispatch = useDispatch<AppDispatch>();
  const locale = useLocale() as "ar" | "en";
  React.useEffect(() => {
    fetchData(); // Fetch products by category
    }, [searchQuery, columnFilters, pagination, sorting]);
  return (
    <Paper>
      <MaterialReactTable 
        columns={columns} 
        data={customers} 
        enableRowSelection
        enableGlobalFilter= {false}
        columnFilterDisplayMode = 'popover'
        positionToolbarAlertBanner= 'bottom'
        getRowId = {(row) => row._id}
        localization={locale === 'ar' ? MRT_Localization_AR : MRT_Localization_EN}

        columnResizeDirection= {locale ==='ar' ? 'rtl' : 'ltr'}

        manualFiltering={true}
        manualPagination={true}
        manualSorting={true}
        onSortingChange={(updaterOrValue) => {
          const newSorting =
          typeof updaterOrValue === "function"
              ? updaterOrValue(sorting)
              : updaterOrValue;
          console.log(newSorting);
          dispatch(setSorting(newSorting));
      }}
        onColumnFiltersChange={(updaterOrValue) => {
            const newColumnFilters =
            typeof updaterOrValue === "function"
                ? updaterOrValue(columnFilters)
                : updaterOrValue;
            dispatch(setColumnFilters(newColumnFilters));
        }}
        // onGlobalFilterChange={(newGlobalFilter: string) => dispatch(setSearchQuery(newGlobalFilter))}        
        muiDetailPanelProps= {() => ({
          sx: (theme) => ({
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,210,244,0.1)'
                : 'rgba(0,0,0,0.1)',
          }),
        })}
        onPaginationChange={(updaterOrValue) => {
          const newPagination =
          typeof updaterOrValue === "function"
              ? updaterOrValue(pagination)
              : updaterOrValue;
          dispatch(setPagination(newPagination));
      }}
      rowCount={rowCount}
      state={{
          globalFilter: searchQuery,
          isLoading: loading,
          pagination,
          columnFilters,
          sorting
      }}
        layoutMode='grid'

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
        initialState= {{
          columnVisibility: {
            email: false,
            street: false,

          },
        }}
        enableColumnResizing
        enableColumnActions={false}
        renderTopToolbarCustomActions = {({ table }) => (<CustomToolbar table={table}/>)}
      />
    </Paper>
  );
}
