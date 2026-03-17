export const getImageUrl = (url?: string | null) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  
  let imgPath = url.replace(/\\/g, '/');
  const uploadIndex = imgPath.indexOf('uploads/');
  
  if (uploadIndex !== -1) {
    imgPath = '/' + imgPath.substring(uploadIndex);
  } else if (!imgPath.startsWith('/')) {
    imgPath = '/' + imgPath;
  }
  
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  return `${baseUrl}${imgPath}`;
};
