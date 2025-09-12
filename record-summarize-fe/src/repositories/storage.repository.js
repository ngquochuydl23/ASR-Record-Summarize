import axios from "axios";
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(process.env.REACT_APP_API_ENDPOINT + "/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
