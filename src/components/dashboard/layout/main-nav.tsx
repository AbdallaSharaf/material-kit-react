'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { Globe as GlobeIcon } from '@phosphor-icons/react/dist/ssr/Globe';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';

import { usePopover } from '@/hooks/use-popover';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import LanguagePopover from './language-popover';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store/store';
import { restoreSession } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';


export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const userPopover = usePopover<HTMLDivElement>();
  const languagePopover = usePopover<HTMLButtonElement>(); // Updated ref type
  React.useEffect(() => {
    dispatch(restoreSession());
  }, []);

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="UI Page">
                <IconButton onClick={() => router.push("https://fruits-heaven.vercel.app/")}>
                  <EyeIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="dot">
                <IconButton>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Tooltip title="Switch Language">
              <IconButton
                onClick={languagePopover.handleOpen}
                ref={languagePopover.anchorRef} // Correctly typed ref
              >
                <GlobeIcon />
              </IconButton>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/avatar.png"
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current || undefined} onClose={userPopover.handleClose} open={userPopover.open} />
      <LanguagePopover anchorEl={languagePopover.anchorRef.current || undefined} onClose={languagePopover.handleClose} open={languagePopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
