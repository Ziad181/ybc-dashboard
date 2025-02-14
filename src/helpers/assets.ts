export const getAssetPath = (path: string): string => {
  return import.meta.env.BASE_URL + path;
};


export const getAssetUploadedFilesPath = (path: string): string => {
  if (path && path instanceof File) {
    return URL.createObjectURL(path);
  }

  if (path && path.startsWith("http")) {
    return path;
  }
  return  path ? import.meta.env.VITE_APP_IMAGE_URL + path : "";
};