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

import CustomToolbar from '../products/custom-toolbar';
import Swal from 'sweetalert2';

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
import Image from 'next/image';
import TablePaginationActions, { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';
import axiosInstance from '@/utils/axiosInstance';
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

  // const handleDownload = async (rowData: any) => {
  //   try {

  //     fetch(`https://sge-commerce.onrender.com/api/v1/order/invoice/${rowData._id}`)
  // .then(res => res.json())
  // .then(({ data, contentType }) => {
  //   const byteCharacters = atob(data); // decode base64
  //   const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
  //   const byteArray = new Uint8Array(byteNumbers);
  //   const blob = new Blob([byteArray], { type: contentType });

  //   const blobUrl = URL.createObjectURL(blob);
  //   window.open(blobUrl); // Opens in a new tab
  // })
  // .catch(err => console.error('Failed to load PDF preview', err));
  //     // const response = await axios.get(`https://sge-commerce.onrender.com/api/v1/order/invoice/${rowData._id}`);
  
  //     // const url = window.URL.createObjectURL(new Blob([response.data]));
  //     // const link = document.createElement('a');
  //     // link.href = url;
  //     // link.setAttribute('download', `order_${rowData._id}.pdf`);
  //     // document.body.appendChild(link);
  //     // link.click();
  //     // link.remove();

  //     // const downloadBase64PDF = (base64Data, filename) => {
  //     //   const link = document.createElement('a');
  //     //   link.href = `data:application/pdf;base64,${base64Data}`;
  //     //   link.download = filename;
  //     //   document.body.appendChild(link);
  //     //   link.click();
  //     //   document.body.removeChild(link);
  //     // };
  
  //     // downloadBase64PDF(response.data, 'order.pdf');
  //   } catch (error) {
  //     console.error('Error downloading PDF:', error);
  //   }
  // };

  // const handleDownload = async (rowData: any) => {
  //   try {
  //     // Show loading alert
  //     Swal.fire({
  //       title: 'Generating Invoice...',
  //       text: 'Please wait while we prepare your PDF.',
  //       allowOutsideClick: false,
  //       didOpen: () => {
  //         Swal.showLoading();
  //       },
  //     });
  
  //     const response = await axiosInstance.get(`order/invoice/${rowData._id}`);
  //     const { data } = response;
  //     const contentType = response.headers['content-type'];
  
  //     // Decode base64 to byte array
  //     const byteCharacters = atob(data);
  //     const byteNumbers = new Array(byteCharacters.length)
  //       .fill(0)
  //       .map((_, i) => byteCharacters.charCodeAt(i));
  //     const byteArray = new Uint8Array(byteNumbers);
  //     const blob = new Blob([byteArray], { type: contentType });
  
  //     // Create download link
  //     const blobUrl = URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = blobUrl;
  //     link.download = `order_${rowData._id}.pdf`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(blobUrl);
  
  //     // Show success alert
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Download Complete',
  //       text: 'Your invoice has been successfully downloaded.',
  //       timer: 2000,
  //       showConfirmButton: false,
  //     });
  //   } catch (error) {
  //     console.error('Error downloading PDF:', error);
  
  //     // Show error alert
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Download Failed',
  //       text: 'Something went wrong while downloading the invoice.',
  //     });
  //   }
  // };


const handleDownload = async (rowData: any) => {
  try {
    Swal.fire({
      title: 'Generating Invoice...',
      text: 'Please wait while we prepare your PDF.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    
    const res = await fetch(`https://sge-commerce.onrender.com/api/v1/order/invoice/${rowData._id}`);
    const { data, contentType, filename } = await res.json();

    if (!data) throw new Error('Missing PDF data');

    // Decode base64 to byte array
    const byteCharacters = atob(data); // make sure data is clean base64
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: contentType });
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || `order_${rowData._id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);

    Swal.fire({
      icon: 'success',
      title: 'Invoice Downloaded',
      text: 'The invoice has been successfully downloaded.',
      timer: 2000,
      showConfirmButton: false,
    });

  } catch (error) {
    console.error('Error downloading PDF:', error);
    Swal.fire({
      icon: 'error',
      title: 'Download Failed',
      text: 'An error occurred while downloading the invoice.',
    });
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
      accessorKey: 'invoiceId',
      header: t('Invoice Id'),
      size: 100,
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
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
              : status === 'processing'
                ? 'secondary'
                : status === 'onDelivery'
                  ? 'info'
                  : status === 'delivered'
                    ? 'success'
                    : status === 'canceled'
                      ? 'error'
                      : status === 'returned'
                        ? 'warning'
                        : 'default';
    
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
              {[
                'newOrder',
                'accepted',
                'processing',
                'onDelivery',
                'delivered',
                'canceled',
                'returned',
              ].map((option) => (
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
      filterSelectOptions: [t('COD'), t('CC')],
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
              {row.original.items.map((item) => (
                <Box
                  key={item._id}
                  className="flex items-center justify-between gap-20 bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  {/* Image */}
                  <div className='flex items-center'>

                  <Box className="w-16 h-16 flex-shrink-0 rounded overflow-hidden border border-gray-200">
                  <Image
                    src={
                      Array.isArray(item?.imgCover)
                      ? item.imgCover[0] || "/placeholder.png"
                      : item?.imgCover || "/placeholder.png"
                    }
                    alt={item.name?.['en'] || item.name?.['ar']}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded"
                    unoptimized // optional if you're using external URLs
                    />
                  </Box>
        
                  {/* Name & Quantity */}
                  <Box className="flex flex-col flex-grow px-4">
                    <Typography fontWeight="bold">
                      {item.name?.['en'] || item.name?.['ar']} × {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('Item price')}: {item.itemPrice}
                    </Typography>
                  </Box>
                  </div>
        
                  {/* Total Price */}
                  <Typography fontWeight="bold" className="text-right text-green-600 min-w-[100px]">
                    {t('Total Price')}: {item.totalPrice}
                  </Typography>
                </Box>
              ))}
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
