export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('File could not be converted');
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };