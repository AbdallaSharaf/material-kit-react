'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Stack,
  Typography,
  Grid,
  Button,
  IconButton,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { SettingIn } from '@/interfaces/uiSettingsInterface';
import { useSettingHandlers } from '@/controllers/uiSettingsController';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store/store';
import { convertFileToBase64 } from '@/utils/fileToString';

interface ImageSliderManagerProps {
  sectionKey: 'homeSlider' | 'offersFirstSlider' | 'offersLastSlider';
  title: string;
}

export const ImageSliderManager = ({ sectionKey, title }: ImageSliderManagerProps) => {
  const dispatch = useDispatch();
  const { handleCreateSetting, handleDelete, fetchData } = useSettingHandlers();

  const images = useSelector((state: RootState) => state.uiSettings[sectionKey]);
  const refreshData = useSelector((state: RootState) => state.uiSettings.refreshData);

  const [newImageFile, setNewImageFile] = useState<File | null>(null);
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
        if (!newImageFile) return;
    
        const base64Url = await convertFileToBase64(newImageFile);
        const success = await handleCreateSetting({
        key: sectionKey,
        values: { url: base64Url },
        });
    
        if (success) {
        setNewImageFile(null);
        setPreviewUrl('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };
  

  useEffect(() => {
    fetchData(sectionKey);
  }, [sectionKey, dispatch, refreshData]);


  const handleRemove = async (image: SettingIn) => {
    handleDelete(sectionKey, image);
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">{title}</Typography>
          <Grid container spacing={2}>
            {images.map((image) => (
              <Grid item key={image._id} xs={12} sm={6} md={4}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={image.url}
                    alt="slider"
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                  <IconButton
                    onClick={() => handleRemove(image)}
                    style={{ position: 'absolute', top: 4, right: 4 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Grid>
            ))}
          </Grid>
          <Stack direction="row" spacing={1}>
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
                {newImageFile ? newImageFile.name : 'Choose Image'}
                </Button>

                <Button
                onClick={handleAdd}
                variant="contained"
                startIcon={<AddIcon />}
                disabled={!newImageFile}
                >
                Upload
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