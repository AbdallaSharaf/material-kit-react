"use client"
import { useEffect, useRef, useState } from 'react';
import {
  Stack,
  Typography,
  Grid,
  Button,
  IconButton,
  Card,
  CardContent,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { SettingIn } from '@/interfaces/uiSettingsInterface';
import { useSettingHandlers } from '@/controllers/uiSettingsController';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { convertFileToBase64 } from '@/utils/fileToString';
import { useTranslations } from 'next-intl';

interface ImageSliderManagerProps {
  sectionKey: 'homeSlider' | 'offersFirstSlider' | 'offersLastSlider';
  title: string;
}

export const ImageSliderManager = ({ sectionKey, title }: ImageSliderManagerProps) => {
  const dispatch = useDispatch();
  const { handleCreateSetting, handleDelete, fetchData } = useSettingHandlers();
  const t = useTranslations("common");
  const images = useSelector((state: RootState) => state.uiSettings[sectionKey]);
  const refreshData = useSelector((state: RootState) => state.uiSettings.refreshData);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>(''); // New state for redirectUrl
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleAdd = async () => {
    if (!newImageFile || !redirectUrl) return; // Ensure redirectUrl is provided

    const base64Url = await convertFileToBase64(newImageFile);
    const success = await handleCreateSetting({
      key: sectionKey,
      values: { url: base64Url, redirectUrl: redirectUrl }, // Include redirectUrl
    });

    if (success) {
      setNewImageFile(null);
      setRedirectUrl(''); // Reset the redirectUrl input after image upload
      setPreviewUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    fetchData(sectionKey);
  }, [sectionKey, dispatch, refreshData]);

  const handleRemove = async (idx: number) => {
    handleDelete(sectionKey, idx);
  };

  const handleRedirectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRedirectUrl(e.target.value);
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">{title}</Typography>
          <Grid container spacing={2}>
            {images?.map((image, idx) => (
              <Grid item key={idx} xs={12} sm={6} md={4}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={image.url}
                    alt="slider"
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                  <IconButton
                    onClick={() => handleRemove(idx)}
                    style={{ position: 'absolute', top: 4, right: 4 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Typography variant="body2" style={{ marginTop: 8 }}>
                    {image.redirectUrl}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>

          {/* Input for Redirect URL when adding a new image */}
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              label={t('redirect URL')}
              value={redirectUrl}
              onChange={handleRedirectUrlChange}
              
              required
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
            >
              {newImageFile ? newImageFile.name : t('Choose Image')}
            </Button>

            <Button
              onClick={handleAdd}
              variant="contained"
              startIcon={<AddIcon />}
              disabled={!newImageFile || !redirectUrl}
            >
              {t("Upload")}
            </Button>
          </Stack>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '200px', borderRadius: 8, marginTop: 10 }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ImageSliderManager;
