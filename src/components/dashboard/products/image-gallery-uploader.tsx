import { Box, IconButton, Typography } from "@mui/material";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";

// 👇 New Component: Drag-and-Drop Image Gallery Uploader
export const ImageGalleryUploader = ({ 
    images, 
    setFieldValue,
    errors,
    touched 
  }: { 
    images: string[], 
    setFieldValue: (field: string, value: any) => void,
    errors: any,
    touched: any 
  }) => {
    const t = useTranslations("common");
    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (images.length + acceptedFiles.length > 5) {
        Swal.fire({
          icon: 'error',
          title: 'Maximum limit reached',
          text: 'You can upload a maximum of 5 images.',
        });
        return;
      }
  
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setFieldValue('images', [...images, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }, [images, setFieldValue]);
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png', '.webp']
      },
      maxFiles: 5 - images.length,
    });
  
    const removeImage = (index: number) => {
      const newImages = [...images];
      newImages.splice(index, 1);
      setFieldValue('images', newImages);
    };
  
    return (
      <Box>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#f0f0f0' : 'transparent',
            marginBottom: '16px',
          }}
        >
          <input {...getInputProps()} />
          <Typography sx={{ mb: images.length ? 2 : 0 }}>
            {isDragActive ? t('Drop images here') : t('Drag & drop up to 5 images (min 1 required)')}
          </Typography>
  
          {/* 👇 Preview inside the dropzone */}
          {images.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
              {images.map((img, index) => (
                <Box key={index} sx={{ position: 'relative', width: 80, height: 80 }}>
                  <img
                    src={img}
                    alt={`Product Image ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                  <IconButton
                    onClick={() => removeImage(index)}
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      backgroundColor: 'white',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      padding: '2px',
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
  
        {/* Error message */}
        {touched.images && errors.images && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {errors.images}
          </Typography>
        )}
      </Box>
    );
  };
  