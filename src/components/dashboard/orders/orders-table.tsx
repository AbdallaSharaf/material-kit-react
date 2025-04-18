'use client';

import * as React from 'react';
import {
  Button,
  Chip,
  ChipProps,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';

import CustomToolbar from './custom-toolbar';

import '@fortawesome/fontawesome-free/css/all.min.css';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useOrderHandlers } from '@/controllers/ordersController';
import { OrderIn } from '@/interfaces/orderInterface';
import { setColumnFilters, setPagination, setSearchQuery } from '@/redux/slices/orderSlice';
import { AppDispatch, RootState } from '@/redux/store/store';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import {useLocale, useTranslations } from 'next-intl';
import axios from 'axios';
import { MRT_Localization_AR } from 'material-react-table/locales/ar';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
// Define columns outside the component to avoid defining them during render
export function OrdersTable(): React.JSX.Element {

  // const handleDownload = async (rowData:any) => {
  //   const response = await axios.post('../../../app/api/generate-invoice', rowData, {
  //     responseType: 'blob',
  //   });
  
  //   const url = window.URL.createObjectURL(new Blob([response.data]));
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.setAttribute('download', `order_${rowData._id}.pdf`);
  //   document.body.appendChild(link);
  //   link.click();
  // };

  const handleDownload = async (rowData: any) => {
    try {
      const response = await axios.post('/api/download-invoice', rowData, {
        responseType: 'blob',
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `order_${rowData._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const t = useTranslations("common")
  const { fetchData, handleChangeStatus } = useOrderHandlers();
  const dispatch = useDispatch<AppDispatch>();
  const locale = useLocale() as "en" | "ar"
  const { refreshData, loading, orders, rowCount, pagination, columnFilters, searchQuery } = useSelector(
    (state: RootState) => state.orders
  );

  const orderColumns: MRT_ColumnDef<OrderIn>[] = [
    {
      accessorKey: 'name',
      header: t('Name'),
      size: 140,
      Cell: ({ row }) => row.original.shippingAddress?.name ?? row.original.user?.name ?? 'N/A',
      enableColumnFilter: true,
      enableSorting: false,
    },
    {
      accessorKey: 'shippingAddress.phone',
      header: t('Phone'),
      size: 110,
      enableColumnFilter: true,
      enableSorting: false,
    },
    {
      accessorKey: 'email',
      header: t('Email'),
      size: 150,
      Cell: ({ row }) => row.original.shippingAddress.email,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorKey: 'createdAt',
      header: t('Date'),
      filterVariant: 'datetime-range',
      size: 160,
      Cell: ({ cell }) => <div>{dayjs(cell.getValue<string>()).format('MMMM D, YYYY, h:mm A')}</div>,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorKey: 'status',
      header: t('Status'),
      size: 100,
      Cell: ({ cell, row }) => {
        const status = cell.getValue<string>();
        const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);

        const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        };

        const handleCloseMenu = () => {
          setAnchorEl(null);
        };

        const handleStatusChange = async (newStatus: string) => {
          handleCloseMenu();
          try {
            await handleChangeStatus({ _id: row.original._id, status: newStatus });
          } catch (error) {
            console.error('Failed to update status:', error);
          }
        };

        const color: ChipProps['color'] =
          status === 'newOrder'
            ? 'default'
            : status === 'accepted'
              ? 'primary'
              : status === 'shipped'
                ? 'info'
                : status === 'delivered'
                  ? 'success'
                  : status === 'cancelled'
                    ? 'error'
                    : 'warning';

        return (
          <>
            <Chip
              label={t(status)}
              color={color}
              size="small"
              onDoubleClick={handleOpenMenu}
              sx={{ cursor: 'pointer' }}
            />
            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
              {['newOrder', 'accepted', 'shipped', 'delivered', 'cancelled', 'returned'].map((option) => (
                <MenuItem
                  key={option}
                  selected={option === status}
                  onClick={() => handleStatusChange(option)}
                >
                  {t(option)}
                </MenuItem>
              ))}
            </Menu>
          </>
        );
      },
    },
    {
      accessorKey: 'paymentMethod',
      header: t('Payment Method'),
      size: 166,
      filterVariant: 'select',
      filterSelectOptions: [t('cod'), t('credit_card')],
      Cell: ({ cell }) => {
        const value = cell.getValue<string>();
        const label = value === 'cod' ? t('COD') : t('CC');
        const color: ChipProps['color'] = value === 'cod' ? 'default' : 'primary';
    
        return (
          <Chip
            label={label}
            color={color}
            size="small"
            variant="outlined"
          />
        );
      }
    },
    {
      accessorKey: 'isPaid',
      header: t('Payment Status'),
      size: 155,
      filterVariant: 'checkbox',
      Cell: ({ cell }) => {
        const value = cell.getValue<boolean>();
        const label = value ? t('Paid') : t('Unpaid');
        const color: ChipProps['color'] = value ? 'success' : 'warning';

        return <Chip label={label} color={color} size="small" variant="outlined" />;
      },
    },
    {
      accessorKey: 'totalPrice',
      header: t('Total'),
      size: 100,
      filterVariant: 'range-slider',
      muiFilterSliderProps: {
        marks: true,
        max: 10000,
        min: 100,
        step: 100,
        valueLabelFormat: (value) => `${value} SAR`,
      },
      Cell: ({ cell }) => <div>{cell.getValue<number>()} SAR</div>,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorKey: 'shippingAddress.street',
      header: t('Street'),
      size: 100,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorKey: 'shippingAddress.city',
      header: t('City'),
      size: 100,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      accessorKey: 'country',
      header: t('Country'),
      size: 100,
      Cell: ({ row }) => row.original.shippingAddress?.country ?? 'N/A',
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      header: 'Actions',
      enableColumnActions: false,
      size: 80,
      Cell: ({ row }) => (
        <IconButton onClick={() => handleDownload(row.original)} aria-label="download pdf" color="primary">
        <PictureAsPdfIcon />
      </IconButton>
        )
    }
  ];

  React.useEffect(() => {
    fetchData();
  }, [refreshData, searchQuery, columnFilters, pagination]);

  return (
    <Paper>
      <MaterialReactTable
        columns={orderColumns}
        data={orders}
        enableRowSelection
        columnResizeDirection= {locale ==='ar' ? 'rtl' : 'ltr'}
        enableColumnResizing
        enableGlobalFilter={true}
        enableSorting={true}
        localization={locale === 'ar' ? MRT_Localization_AR : MRT_Localization_EN}
        initialState={{
          columnVisibility: {
            email: false,
            country: false,
          },
          density: 'compact'
        }}
        columnFilterDisplayMode="popover"
        state={{
          globalFilter: searchQuery,
          isLoading: loading,
          pagination,
          columnFilters,
        }}
        positionToolbarAlertBanner="bottom"
        manualFiltering={true}
        manualPagination={true}
        onColumnFiltersChange={(updaterOrValue) => {
          const newColumnFilters =
            typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue;
          dispatch(setColumnFilters(newColumnFilters));
        }}
        onGlobalFilterChange={(newGlobalFilter: string) => dispatch(setSearchQuery(newGlobalFilter))}
        onPaginationChange={(updaterOrValue) => {
          const newPagination = typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue;
          dispatch(setPagination(newPagination));
        }}
        rowCount={rowCount}
        enableExpandAll={false} //disable expand all button
        muiDetailPanelProps={() => ({
          sx: (theme) => ({
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,210,244,0.1)' : 'rgba(0,0,0,0.1)',
          }),
        })}
        //conditionally render detail panel
        renderDetailPanel={({ row }) =>
          row.original.items.length > 0 ? (
            <Box className="flex flex-col gap-3">
              {row.original.items.map((item) => {
                return (
                  <Box key={item._id} className="grid grid-cols-2 items-center">
                    <Box className="flex flex-col gap-1">
                      <Typography>
                        <strong>{t('Name')}:</strong> {item.name?.['en'] || item.name?.['ar']}
                      </Typography>
                      <Typography>
                        <strong>{t("Quantity")}:</strong> {item.quantity}
                      </Typography>
                    </Box>
                    <Box className="flex flex-col gap-1">
                      <Typography>
                        <strong>{t("Item price")}:</strong> {item.itemPrice}
                      </Typography>
                      <Typography>
                        <strong>{t("Total Price")}:</strong> {item.totalPrice}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : null
        }
        layoutMode="grid"
        renderTopToolbarCustomActions={({ table }) => <CustomToolbar table={table} data={orders} />}
        muiTableHeadRowProps={{
          sx: {
            height: '50px', // increase header row height
            
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            '& .Mui-TableHeadCell-Content-Wrapper': {
              overflow: 'visible !important', // override overflow
            },
            '& .Mui-TableHeadCell-Content': {
              height: '100%',
            },
            '& .Mui-TableHeadCell-Content-Labels': {
              height: '100%',
            },
          },
        }}
      
      />
    </Paper>
  );
}
