import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

export const uploadFiles = async (jdFile, resumeFile) => {
  const formData = new FormData();
  formData.append("jd", jdFile);
  formData.append("resume", resumeFile);

  try {
    const res = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
};
