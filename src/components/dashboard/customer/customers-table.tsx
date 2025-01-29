'use client';

import * as React from 'react';
import { MaterialReactTable, MRT_ColumnDef, MRT_EditActionButtons, MRT_TableOptions } from 'material-react-table';
import Avatar from '@mui/material/Avatar';
import { DialogActions, DialogContent, DialogTitle, IconButton, Paper, Tooltip } from '@mui/material';
import CustomToolbar from './custom-toolbar';
import { Box } from '@mui/system';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.min.css';


export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
  phone: string;
}

interface CustomersTableProps {
  data?: Customer[];
}

const handleSaveRow: MRT_TableOptions<Customer>['onEditingRowSave'] = ({
  exitEditingMode,
}) => {
  exitEditingMode();
};

// Define columns outside the component to avoid defining them during render
const columns: MRT_ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    Cell: ({ row }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Avatar src={row.original.avatar} />
        {row.original.name}
      </div>
    ),
  },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'ordersCount',
    header: 'NO. of orders',
  },
  {
    accessorKey: 'totalSpent',
    header: 'Total Spent',
    Cell: ({ cell }) => <div>{cell.getValue<number>()} SAR</div>,
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

export function CustomersTable({
  data = [],
}: CustomersTableProps): React.JSX.Element {


  return (
    <Paper>
      <MaterialReactTable 
        columns={columns} 
        data={data} 
        enableRowSelection
        createDisplayMode= 'modal' //default ('row', and 'custom' are also available)
        editDisplayMode= 'modal' //default ('row', 'cell', 'table', and 'custom' are also available)
        enableEditing = {true}
        enableRowActions
        onEditingRowSave={handleSaveRow} 
        columnFilterDisplayMode = 'popover'
        positionToolbarAlertBanner= 'bottom'
        getRowId = {(row) => row.id}
        renderCreateRowDialogContent={ ({ table, row, internalEditComponents }) => (
          <>
            <DialogTitle variant="h3">Create New User</DialogTitle>
            <DialogContent
              sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {internalEditComponents} {/* or render custom edit components here */}
            </DialogContent>
            <DialogActions>
              <MRT_EditActionButtons variant="text" table={table} row={row} />
            </DialogActions>
          </>
        )}
        //optionally customize modal content
        renderEditRowDialogContent = {({ table, row, internalEditComponents }) => (
          <>
            <DialogTitle variant="h3">Edit User</DialogTitle>
            <DialogContent
              sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              {internalEditComponents} {/* or render custom edit components here */}
            </DialogContent>
            <DialogActions>
              <MRT_EditActionButtons variant="text" table={table} row={row} />
            </DialogActions>
          </>
        )}
        renderTopToolbarCustomActions = {({ table }) => (<CustomToolbar table={table} data={data}/>)}
        renderRowActions= {({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
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
