import { authAPI } from "@/api/api";
import { setAccessToken, clearAccessToken } from "@/utils/tokenStorage";

export const login = async (email, password) => {
  const response = await authAPI.login(email, password);
  
  if (!response.ok) {
    throw { response: { data: response.data } };
  }

  setAccessToken(response.data.tokens.access);

  return response.data;
};

export const logout = async () => {
  const response = await authAPI.logout();
  clearAccessToken();
  return response;
};

export const whoami = async () => {
  const response = await authAPI.whoami();
  if (!response.ok) {
    throw { response: { data: response.data } };
  }
  return response.data;
};

