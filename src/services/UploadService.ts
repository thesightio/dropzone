import axios from 'axios'

export enum InfoStatus {
  Loaded = "Loaded",
  Started = "Started",
  Pending = "Pending"
}

export const upload = (file:File, onUploadProgress:any, onError: any, onFinnaly: any) => {
  let formData:FormData = new FormData();

  formData.append("file", file);

  axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
  })
  .catch(onError)
  .finally(onFinnaly);
};

export default upload; 