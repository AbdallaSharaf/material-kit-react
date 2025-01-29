import { Button } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { MRT_Row } from 'material-react-table';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Customer } from './customers-table';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});


export default function CustomToolbar({table, data}: any) {
    const handleExportRows = (rows: MRT_Row<Customer>[]) => {
        const rowData = rows.map((row) => {
          return {
            name: row.original.name,
            phone: row.original.phone,
            email: row.original.email,
            ordersCount: row.original.ordersCount,
            totalSpent: row.original.totalSpent,
          };
        });
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
      };
      
      const handleExportData = () => {
        const rowData = data.map((customer: Customer) => ({
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          ordersCount: customer.ordersCount,
          totalSpent: customer.totalSpent,
        }));
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
      };
  
  return (
        <Box
        sx={{
        display: 'flex',
        gap: '16px',
        padding: '8px',
        flexWrap: 'wrap',
        }}
    >
        <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={()=>table.setCreatingRow(true)}>
          Add
        </Button>
        <Button
        //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
        onClick={handleExportData}
        startIcon={<FileDownloadIcon />}
        >
        Export All Data
        </Button>
        <Button
        disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
        }
        //only export selected rows
        onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        startIcon={<FileDownloadIcon />}
        >
        Export Selected Rows
        </Button>
    </Box>
  )
}

