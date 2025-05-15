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
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CustomToolbar from './custom-toolbar';
import Swal from 'sweetalert2';

import '@fortawesome/fontawesome-free/css/all.min.css';
import ReceiptIcon from '@mui/icons-material/Receipt';
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
import { fetchOrderCount, fetchOrders, setLastKnownCount } from '@/redux/slices/orderSlice';


const POLL_INTERVAL = 0.1 * 60 * 1000; 
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


  const handleDownload = async (rowData: { _id: string }) => {
    try {
      Swal.fire({
        title: 'Generating Invoice...',
        text: 'Please wait while we prepare your PDF.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
  
   
      const response = await axios.get(`https://fruits-heaven-api.onrender.com/api/v1/order/invoice/${rowData._id}`);
  
      const { data } = response;
  
      // Validate response format
      if (!data || !data.data || !data.contentType || !data.filename) {
        throw new Error('Invalid response from server');
      }
  
      const { data: base64String, contentType, filename } = data;
  
      // Convert base64 to binary
      const byteCharacters = atob(base64String); // decode base64
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
  
      // Create blob and download link
      const blob = new Blob([byteArray], { type: contentType });
      const blobUrl = URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || `order_${rowData._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl); // clean up memory
  
      Swal.fire({
        icon: 'success',
        title: 'Invoice Downloaded',
        text: 'The invoice has been successfully downloaded.',
        timer: 2000,
        showConfirmButton: false,
      });
  
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: error?.message || 'An unexpected error occurred while downloading the invoice.',
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
  const lastKnownCount = useSelector((state: RootState) => state.orders.lastKnownCount);
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
      accessorKey: 'shippingAddress.location',
      header: t('Location'),
      size: 120,
      enableColumnFilter: false,
      enableSorting: false,
      Cell: ({ row }) => {
        const location = row.original.shippingAddress?.location;
        // if (!location) return 'N/A';
        if (location =='https://www.google.com/maps?q=null,null' || !location) return (        <Tooltip title={t( "user didn't set location")}>

        <Button
          // variant="outlined"
          size="small"
          // onClick={() => {
          //   // Open Google Maps with the location
          //   window.open(location, '_blank');
          // }}
          disabled
        >
          {/* {t('View on Map')} */}
          <LocationOnIcon/>
        </Button>
        </Tooltip>);
        
        return (
          <Tooltip title={t('View on Map')}>

          <Button
            // variant="outlined"
            size="small"
            onClick={() => {
              // Open Google Maps with the location
              window.open(location, '_blank');
            }}
          >
            {/* {t('View on Map')} */}
            <LocationOnIcon/>
          </Button>
          </Tooltip>
        );
      },
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

        return <Chip label={label} color={color} size="small"  />;
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
      Cell: ({ row }) =>( 
        <Tooltip title={row.original.shippingAddress.street}>
        <span>{row.original.shippingAddress.street  ?? ''} </span>
        </Tooltip>
        ),
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
      accessorKey: 'notes',
      header: t('notes'),
      size: 100,
      Cell: ({ row }) =>( 
        <Tooltip title={row.original.notes}>
        <span>{row.original.notes  ?? ''} </span>
        </Tooltip>
        ),
      enableColumnFilter: false,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      header: t('download invoice'),
      enableColumnActions: false,
      size: 110,
      muiTableBodyCellProps: {
        align: 'center',
      },
      Cell: ({ row }) => (
        <Tooltip title={t('download invoice')}>

        <IconButton onClick={() => handleDownload(row.original)} aria-label="download pdf" color="primary">
        <ReceiptIcon />
      </IconButton>
        </Tooltip>
        )
    }
  ];
  React.useEffect(() => {
    const interval = setInterval(async () => {
      console.log("lastKnownCount",lastKnownCount)
      try {
        const result = await dispatch(fetchOrderCount()).unwrap();
        if (lastKnownCount !== null && result !== lastKnownCount) {
          Swal.fire(t('You have new orders!'));
          // count changed, refetch orders
          fetchData();
        }
        dispatch(setLastKnownCount(result));
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [dispatch, lastKnownCount, columnFilters, searchQuery, refreshData, pagination]);
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
        enableColumnActions={false}
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
            "& .MuiCollapse-root": {
              width: "60%"
            }
          }),
        })}
        //conditionally render detail panel
        renderDetailPanel={({ row }) =>
          row.original.items.length > 0 ? (
            <Box className="w-full overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Item')}
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Quantity')}
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Unit Price')}
                    </th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('Total Price')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {row.original.items.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-5 items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            <Image
                              src={
                                Array.isArray(item?.imgCover)
                                  ? item.imgCover[0] || "/placeholder.png"
                                  : item?.imgCover || "/placeholder.png"
                              }
                              alt={item.name?.[locale]}
                              width={64}
                              height={64}
                              className="h-16 w-16 object-cover rounded border border-gray-200"
                              unoptimized
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name?.[locale]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.itemPrice}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {item.totalPrice}
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="px-6 py-4 text-start text-sm font-medium text-gray-900">
                      {t('Order Total')}:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                      {row.original.totalPrice}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          ) : null
        }
        
        layoutMode="grid"
        renderTopToolbarCustomActions={({ table }) => <CustomToolbar table={table} />}
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
