import axios from 'axios';

// Set your Cloudinary upload preset and cloud name here
const cloudName = 'dhrk71pn9';
const uploadPreset = 'fruits-heaven'; // set this in your Cloudinary settings

/**
 * Uploads a photo to Cloudinary.
 * @param {File} file - The file to upload.
 * @returns {Promise} - Returns a promise that resolves with the upload response.
 */
const uploadPhotoToCloudinary = async (file: any) => {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

export const uploadPhoto = async (file: any) => {
  try {
      // Use the new Cloudinary function
      const uploadResult = await uploadPhotoToCloudinary(file);
      
      // Cloudinary provides a secure URL in the response
      console.log('File available at:', uploadResult.secure_url);
      return uploadResult.secure_url; // Return the URL for further use
  } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Handle the error as needed
  }
};