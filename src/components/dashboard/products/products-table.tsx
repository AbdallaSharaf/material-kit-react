"use client";

import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';
import { IconButton, Paper, Switch, Tooltip } from '@mui/material';
import CustomToolbar from './custom-toolbar';
import { Box } from '@mui/system';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { CategoryIn } from '@/interfaces/categoryInterface';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { useCategoryHandlers } from '@/controllers/categoriesController';

export const availableCategories: string[] = [
  'aromatic',
  'organic',
  'skincare',
  'hydrating',
  'luxury',
  'floral',
  'makeup',
  'bold',
  'natural',
  'soothing',
  'refreshing',
  'antioxidant',
  'vegan',
  'cruelty-free',
];

export interface Product {
    _id: string;
    image: string;
    name: string;
    price: number;
    updatedAt: Date;
    categories: CategoryIn[];
    isPricePerKilo: boolean; // true if the price is per kilogram, false if per piece
    isActive: boolean;
  }  
  

interface ProductsTableProps {
  data?: Product[];
}

const handleSaveRow: MRT_TableOptions<Product>['onEditingRowSave'] = ({
  exitEditingMode,
}) => {
  exitEditingMode();
};
const categoryDummy = {
  name: {
      ar: "بوكسات",
      en: "Boxes"
  },
  description: {
      ar: "وصف بوكسات",
      en: "Boxed products description"
  },
  showInTopMenu: true,
  _id: "67dc6cc098d32ef1f31ebff1",
  slug: "boxes",
  photos: [],
  order: 1,
  available: true,
  deleted: false,
  createdAt: "2025-03-20T19:30:08.661Z",
  updatedAt: "2025-03-20T19:30:08.661Z",
  __v: 0,
}

export const products: Product[] = [
  {
    _id: 'PRD-005',
    name: 'Soja & Co. Eucalyptus',
    image: '/assets/product-5.png',
    price: 150, // Price in SAR
    updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
    categories: [categoryDummy],
    isPricePerKilo: true,
    isActive: true,
  },
  {
    _id: 'PRD-004',
    name: 'Necessaire Body Lotion',
    image: '/assets/product-4.png',
    price: 120,
    updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),
    categories: [categoryDummy],
    isPricePerKilo: false,
    isActive: true,
  },
  {
    _id: 'PRD-003',
    name: 'Ritual of Sakura',
    image: '/assets/product-3.png',
    price: 200,
    updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),
    categories: [categoryDummy],
    isPricePerKilo: true,
    isActive: true,
  },
  {
    _id: 'PRD-002',
    name: 'Lancome Rouge',
    image: '/assets/product-2.png',
    price: 180,
    updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),
    categories: [categoryDummy],
    isPricePerKilo: false,
    isActive: true,
  },
  {
    _id: 'PRD-001',
    name: 'Erbology Aloe Vera',
    image: '/assets/product-1.png',
    price: 250,
    updatedAt: dayjs().subtract(10, 'minutes').toDate(),
    categories: [categoryDummy],
    isPricePerKilo: true,
    isActive: true,
  },
];

const handleToggleActiveStatus = (id: string) => {
  // Find the product and update its status
  const index = products.findIndex((p) => p._id === id);
  if (index !== -1) {
    products[index].isActive = !products[index].isActive;
  }
};

// Define columns outside the component to avoid defining them during render
const columns: MRT_ColumnDef<Product>[] = [
    {
      accessorKey: '_id',
      header: 'Number',
      grow: true,
      size: 70,
      enableColumnActions: false,
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'image',
      header: 'Image',
      enableColumnActions: false,
      enableSorting: false,
      enableColumnFilter: false,
      size: 60,
      Cell: ({ cell }) => (
        <img
          src={cell.getValue<string>()}
          alt="product image"
          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
        />
      ),
    },
    { 
      accessorKey: 'name',
      header: 'Name',
      grow: true,
      size: 140,
    },
    {
        accessorKey: 'categories',
        header: 'Categories',
        size: 140,
        filterVariant: 'select',
        filterSelectOptions: availableCategories.map((category)=> {return {
            label: category,
            value: category
        }}),
        // Custom filter function: returns true if any of the selected categories appear in the row's categories.
        filterFn: (row, columnId, filterValue: any) => {
            const selectedCategories = Array.isArray(filterValue) ? filterValue : [filterValue]; // Force array
          
            if (selectedCategories.length === 0) return true;
          
            const rowCategories = row.getValue<string[]>(columnId);
            if (!Array.isArray(rowCategories)) return false;
          
            return selectedCategories.some((category) => rowCategories.includes(category));
          },
          
        
        Cell: ({ row }) => (
          <div>
            {row.original.categories.map((category, index: number) => (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  marginRight: '4px',
                  fontSize: '12px',
                }}
              >
                {category.name['en']}
              </span>
            ))}
          </div>
        ),
      },
    {
      accessorKey: 'price',
      header: 'Price',
      size: 100,
      filterVariant: 'range-slider',
      muiFilterSliderProps: {
        marks: true,
        max: 10000, // custom max
        min: 100,   // custom min
        step: 100,
        valueLabelFormat: (value) =>
          value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'SAR',
          }),
      },
      Cell: ({ row }) => (
        <div>
          {row.original.price} SAR {row.original.isPricePerKilo ? '/ kg' : '/ p'}
        </div>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Active Status',
      size: 90,
      enableSorting: false,
      enableColumnActions: false,
      filterVariant: 'select', // Enable dropdown filter
      filterSelectOptions: [
        { label: 'Active', value: 'true' },
        { label: 'Inactive', value: 'false' },
      ],
      filterFn: (row, columnId, filterValue) => {
        if (filterValue === 'true') return row.getValue(columnId) === true;
        if (filterValue === 'false') return row.getValue(columnId) === false;
        return true; // Show all if no filter is selected
      },
      Cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          onChange={() => handleToggleActiveStatus(row.original._id)}
          color="primary"
        />
      ),
    },    
  ];
  
const handleDelete = async (id: string) => {
  const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
  });
  console.log(id)
  if (result.isConfirmed) {
      try {
          Swal.fire('Deleted!', 'The user has been deleted.', 'success');
      } catch (error) {
          console.error('Error deleting user:', error);
          Swal.fire('Error!', 'There was a problem deleting the user.', 'error');
      }
  }
};

export function ProductsTable(): React.JSX.Element {

    const { fetchData } = useCategoryHandlers();

    const { 
      refreshData, 
      categories
    } = useSelector((state: RootState) => state.categories);
    React.useEffect(() => {
      fetchData();
      console.log("refetched")
    }, [refreshData]);
    
    const router = useRouter()
console.log(categories[5])
  return (
    <Paper>
      <MaterialReactTable 
        columns={columns} 
        data={products} 
        enableRowSelection
        enableRowActions
        enableColumnResizing
        
        onEditingRowSave={handleSaveRow} 
        columnFilterDisplayMode = 'popover'
        positionToolbarAlertBanner= 'bottom'
        getRowId = {(row) => row._id}
        positionActionsColumn="last" 


        enableExpandAll= {false} //disable expand all button
        muiDetailPanelProps= {() => ({
          sx: (theme) => ({
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,210,244,0.1)'
                : 'rgba(0,0,0,0.1)',
          }),
        })}

        layoutMode='grid'
        renderTopToolbarCustomActions = {({ table }) => (<CustomToolbar table={table} data={products}/>)}
        renderRowActions= {({ row }) => (
          <Box sx={{ display: 'flex', gap: '4px'}}>
            <Tooltip title="Edit">
              <IconButton onClick={() => router.push(`products/edit/${row.original._id}`)}>
                <i
                  className="fa fa-pencil !text-sm text-yellow-500 hover:text-yellow-600 cursor-pointer"
                ></i>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => handleDelete(row.original._id)}>
                <i
                  className="fa fa-trash !text-sm text-red-500 hover:text-red-600 cursor-pointer"
                ></i>
              </IconButton>
            </Tooltip>
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
