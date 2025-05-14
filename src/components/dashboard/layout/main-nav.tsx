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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store/store';
import { fetchUserData, restoreSession } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import MobileNavWrapper from './MobileNavWrapper';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [isNavReady, setIsNavReady] = React.useState<boolean>(false); 
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const userPopover = usePopover<HTMLDivElement>();
  const languagePopover = usePopover<HTMLButtonElement>(); // Updated ref type

  React.useEffect(() => {
    if (user !== null) return;
    console.log('restoring session');
    const restoreSessionData = async () => {
      try {
        const token = localStorage.getItem('custom-auth-token');
        if (!token) throw new Error('No token found');
          await dispatch(fetchUserData());
          setIsNavReady(true); // Ensure the nav is ready after async logic is complete
      } catch (error) {
        console.error('Error restoring session:', error);
      }
    }
    restoreSessionData();
  }, [user]);
  // console.log(user)
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
                <IconButton 
                  onClick={() => window.open("https://fruits-heaven.vercel.app/", "_blank")}
                >
                  <EyeIcon />
                </IconButton>
            </Tooltip>
            {/* <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="dot">
                <IconButton>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip> */}
            <Tooltip title="Switch Language">
              <IconButton
                onClick={languagePopover.handleOpen}
              >
              <LanguagePopover />
            </IconButton>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src={user?.profilePic}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current || undefined} onClose={userPopover.handleClose} open={userPopover.open} />
      {isNavReady && (
        <MobileNavWrapper
          onClose={() => {
            setOpenNav(false);
          }}
          open={openNav}
        />
      )}
    </React.Fragment>
  );
}
