import axios from "axios";

const edlas_api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "content-type": "application/json", accept: "application/json" },
});

export const login = async (email, password) => {
  const res = await edlas_api.post("/system/auth/login/", {
    email,
    password,
  });
  return res.data;
};
