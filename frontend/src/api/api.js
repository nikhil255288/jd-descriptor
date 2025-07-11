const API_BASE = "http://127.0.0.1:5000";

export async function uploadJDResume(jdFile, resumeFile) {
  const formData = new FormData();
  formData.append("jd", jdFile);
  formData.append("resume", resumeFile);

  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload failed");
  }

  return await response.json();
}
