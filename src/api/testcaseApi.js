import axios from "axios";

const API = "http://127.0.0.1:8000";

export function parsePdf(file) {
  const form = new FormData();
  form.append("file", file);
  return axios.post(`${API}/parse-pdf`, form);
}

export function generateTestcases(formData, onDownloadProgress) {
  return axios.post(`${API}/generate-testcases`, formData, {
    responseType: "blob",
    timeout: 180000,
    onDownloadProgress,
  });
}
