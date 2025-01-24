import { Popover, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import * as React from 'react';
import Flag from 'react-world-flags';

export interface UserPopoverProps {
    anchorEl: Element | null;
    onClose: () => void;
    open: boolean;
  }

export function LanguagePopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  return (
    <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={onClose}
        open={open}
        slotProps={{ paper: { sx: { width: '160px' } } }}
    >
        <Box sx={{ p: 2, minWidth: '150px' }}>
        <Stack direction="column" spacing={2}>
            <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'var(--mui-palette-action-hover)' },
                px: 1,
                py: 0.5,
                borderRadius: 1,
            }}
            onClick={() => {
                // Handle switching to English
                onClose();
                console.log('Switched to English');
            }}
            >
            <Flag code="US" style={{ width: 24, height: 16, borderRadius: 2 }} />
            <Typography variant="button">English</Typography>
            </Stack>
            <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'var(--mui-palette-action-hover)' },
                px: 1,
                py: 0.5,
                borderRadius: 1,
            }}
            onClick={() => {
                // Handle switching to Arabic
                onClose();
                console.log('Switched to Arabic');
            }}
            >
            <Flag code="EG" style={{ width: 24, height: 16, borderRadius: 2 }} />
            <Typography variant="button">العربية</Typography>
            </Stack>
        </Stack>
        </Box>
    </Popover>
  )
}

export default LanguagePopover