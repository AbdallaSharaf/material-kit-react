import { Popover, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import * as React from 'react';

export interface UserPopoverProps {
  anchorEl: Element | undefined;
  onClose: () => void;
  open: boolean;
}

// FlagIcon component using FlagsAPI
const FlagIcon = ({ code }: { code: string }) => (
  <img
    src={`https://flagsapi.com/${code}/flat/24.png`}
    alt={code}
    style={{ width: 24, height: 16, borderRadius: 2 }}
  />
);

export default function LanguagePopover({
  anchorEl,
  onClose,
  open,
}: UserPopoverProps): React.JSX.Element {
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
            }}
          >
            <FlagIcon code="US" />
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
            }}
          >
            <FlagIcon code="EG" />
            <Typography variant="button">العربية</Typography>
          </Stack>
        </Stack>
      </Box>
    </Popover>
  );
}
