import { Button } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { MRT_Row } from 'material-react-table';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductIn } from '@/interfaces/productInterface';
import { useTranslations } from 'next-intl';

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});


export default function CustomToolbar({table, data}: any) {
  const t = useTranslations("common");
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category"); // Get category ID from params
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
        <Button
            variant="contained"
            onClick={() => {
              let url = 'products/add';
              if (categoryId) {
                url += `?category=${categoryId}`;
              }
              router.push(url);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{t("Add")}</span>
          <PlusIcon style={{ fontSize: 'var(--icon-fontSize-md)'}} />
        </Button>
        {/* <Button
        //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
        onClick={handleExportData}
        startIcon={<FileDownloadIcon />}
        >
        Export All Data
        </Button>
        <Button
        disabled={
            table && !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
        }
        //only export selected rows
        onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        startIcon={<FileDownloadIcon />}
        >
        Export Selected Rows
        </Button> */}
    </Box>
  )
}

