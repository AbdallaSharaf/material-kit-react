'use client';

import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import { Gear as GearIcon } from '@phosphor-icons/react/dist/ssr/Gear';
import { useTranslations } from 'next-intl';

export default function OrderSettingsModal(): React.JSX.Element {
  const t = useTranslations("common")
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const handleSettingsOpen = () => setSettingsOpen(true);
  const handleSettingsClose = () => setSettingsOpen(false);
  
  const [acceptingLiveOrders, setAcceptingLiveOrders] = React.useState(true);
  // Use a number input: you can initialize as an empty string or a default number.
  const [prepTime, setPrepTime] = React.useState('');
  const [confirmDelivery, setConfirmDelivery] = React.useState(false);

  const handleSave = () => {
    // Convert prepTime to a number if needed (it comes as a string from the TextField)
    const numericPrepTime = parseFloat(prepTime);
    console.log({
      acceptingLiveOrders,
      prepTime: numericPrepTime,
      confirmDelivery,
    });
    handleSettingsClose();
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleSettingsOpen}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        {t("Settings")}
        <GearIcon fontSize="var(--icon-fontSize-md)" />
      </Button>
      <Dialog open={settingsOpen} onClose={handleSettingsClose}>
        <DialogTitle>{t("Order Settings")}</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={acceptingLiveOrders}
                onChange={(e) => setAcceptingLiveOrders(e.target.checked)}
              />
            }
            label="Accepting Live Orders"
          />
          <TextField
            fullWidth
            type="number"
            label="Order Preparation Time (hours)"
            InputLabelProps={{ shrink: true }}
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            sx={{ mt: 2 }}
            helperText="Enter a number (eg, 1, 2, 24 for a day)"
          />
          <FormControlLabel
            control={
              <Switch
                checked={confirmDelivery}
                onChange={(e) => setConfirmDelivery(e.target.checked)}
              />
            }
            label="Confirm Delivery Time"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsClose}>{t("Cancel")}</Button>
          <Button variant="contained" onClick={handleSave}>
            {t("Save")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
