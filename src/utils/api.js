import { authAPI } from "@/api/api";

export const login = async (email, password) => {
  const response = await authAPI.login(email, password);
  
  if (!response.ok) {
    throw { response: { data: response.data } };
  }

  localStorage.setItem("access-token", response.data.tokens.access);
  localStorage.setItem("refresh-token", response.data.tokens.refresh);

  return response.data;
};

export const logout = async () => {
  const response = await authAPI.logout();
  localStorage.removeItem("access-token");
  localStorage.removeItem("refresh-token");
  return response;
};

export const whoami = async () => {
  const response = await authAPI.whoami();
  if (!response.ok) {
    throw { response: { data: response.data } };
  }
  return response.data;
};
