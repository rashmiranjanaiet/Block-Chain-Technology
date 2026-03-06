const API_BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

const safeDecode = (value, fallback) => {
  try {
    return value ? decodeURIComponent(value) : fallback;
  } catch (_error) {
    return fallback;
  }
};

const buildHeaders = ({ headers = {}, token, isFormData }) => {
  const finalHeaders = new Headers(headers);

  if (token) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  if (!isFormData && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  return finalHeaders;
};

const parseError = async (response) => {
  try {
    const data = await response.json();
    return data.message || "Request failed.";
  } catch (_error) {
    return "Request failed.";
  }
};

const request = async (path, { body, headers, method = "GET", token } = {}) => {
  const isFormData = body instanceof FormData;
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: buildHeaders({ headers, token, isFormData }),
    body:
      body && !isFormData && typeof body !== "string" ? JSON.stringify(body) : body
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
};

export const registerUser = (payload) =>
  request("/auth/register", { method: "POST", body: payload });

export const loginUser = (payload) =>
  request("/auth/login", { method: "POST", body: payload });

export const fetchCurrentUser = (token) => request("/auth/me", { token });

export const fetchFiles = (token) => request("/files", { token });

export const uploadFile = (token, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return request("/files/upload", {
    method: "POST",
    token,
    body: formData
  });
};

export const deleteFile = (token, fileId) =>
  request(`/files/${fileId}`, {
    method: "DELETE",
    token
  });

export const downloadOwnerFile = async (token, fileId) => {
  const response = await fetch(`${API_BASE}/files/${fileId}/download`, {
    headers: buildHeaders({ token, isFormData: false })
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return {
    blob: await response.blob(),
    fileName: safeDecode(response.headers.get("X-File-Name"), "download"),
    mimeType:
      response.headers.get("X-Mime-Type") ||
      response.headers.get("Content-Type") ||
      "application/octet-stream"
  };
};

export const accessSharedFile = async (code) => {
  const response = await fetch(`${API_BASE}/access/file`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ code })
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return {
    blob: await response.blob(),
    fileName: safeDecode(response.headers.get("X-File-Name"), "shared-file"),
    mimeType:
      response.headers.get("X-Mime-Type") ||
      response.headers.get("Content-Type") ||
      "application/octet-stream"
  };
};
