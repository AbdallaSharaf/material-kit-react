"use client";

import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef, MRT_TableOptions } from 'material-react-table';
import { IconButton, Paper, Tooltip } from '@mui/material';
import CustomToolbar from './custom-toolbar';
import { Box } from '@mui/system';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from 'next/navigation';

export const availableTags: string[] = [
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
    id: string;
    image: string;
    name: string;
    price: number;
    updatedAt: Date;
    tags: string[];
    isPricePerKilo: boolean; // true if the price is per kilogram, false if per piece
  }  
  

interface ProductsTableProps {
  data?: Product[];
}

const handleSaveRow: MRT_TableOptions<Product>['onEditingRowSave'] = ({
  exitEditingMode,
}) => {
  exitEditingMode();
};

// Define columns outside the component to avoid defining them during render
const columns: MRT_ColumnDef<Product>[] = [
    {
      accessorKey: 'id',
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
        accessorKey: 'tags',
        header: 'Tags',
        size: 140,
        filterVariant: 'select',
        filterSelectOptions: availableTags.map((tag)=> {return {
            label: tag,
            value: tag
        }}),
        // Custom filter function: returns true if any of the selected tags appear in the row's tags.
        filterFn: (row, columnId, filterValue: any) => {
            const selectedTags = Array.isArray(filterValue) ? filterValue : [filterValue]; // Force array
          
            if (selectedTags.length === 0) return true;
          
            const rowTags = row.getValue<string[]>(columnId);
            if (!Array.isArray(rowTags)) return false;
          
            return selectedTags.some((tag) => rowTags.includes(tag));
          },
          
        
        Cell: ({ row }) => (
          <div>
            {row.original.tags.map((tag: string, index: number) => (
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
                {tag}
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

export function ProductsTable({
  data = [],
}: ProductsTableProps): React.JSX.Element {

    const router = useRouter()

  return (
    <Paper>
      <MaterialReactTable 
        columns={columns} 
        data={data} 
        enableRowSelection
        enableRowActions
        enableColumnResizing
        
        onEditingRowSave={handleSaveRow} 
        columnFilterDisplayMode = 'popover'
        positionToolbarAlertBanner= 'bottom'
        getRowId = {(row) => row.id}
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
        renderTopToolbarCustomActions = {({ table }) => (<CustomToolbar table={table} data={data}/>)}
        renderRowActions= {({ row }) => (
          <Box sx={{ display: 'flex', gap: '4px'}}>
            <Tooltip title="Edit">
              <IconButton onClick={() => router.push(`products/edit/${row.original.id}`)}>
                <i
                  className="fa fa-pencil !text-sm text-yellow-500 hover:text-yellow-600 cursor-pointer"
                ></i>
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton color="error" onClick={() => handleDelete(row.original.id)}>
                <i
                  className="fa fa-trash !text-sm text-red-500 hover:text-red-600 cursor-pointer"
                ></i>
              </IconButton>
            </Tooltip>
          </Box>
        )}

      />
    </Paper>
  );
}
