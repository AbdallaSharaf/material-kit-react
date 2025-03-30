import { Button } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { MRT_Row } from 'material-react-table';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useRouter } from 'next/navigation';
import { ProductIn } from '@/interfaces/productInterface';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});


export default function CustomToolbar({table, data}: any) {

    const router = useRouter()

  const handleExportRows = (rows: MRT_Row<ProductIn>[]) => {
    const rowData = rows.map((row) => ({
      id: row.original._id,
    }));
  
    if (rowData.length > 0) {
      const csv = generateCsv(csvConfig)(rowData);
      download(csvConfig)(csv);
    }
  };
  
  const handleExportData = () => {
    if (data.length === 0) return; // Prevent exporting empty data
  
    const rowData = data.map((product: ProductIn) => ({
      id: product._id,
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
        <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained" onClick={()=>router.push(`products/add`)}>
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

