import { mockUsers } from "@/data/staticData";

export const login = async (email, password) => {
  const user = mockUsers[email];
  
  if (!user || user.password !== password) {
    throw { response: { data: { detail: "Invalid email or password" } } };
  }

  return {
    user: {
      full_name: user.full_name,
      email: user.email,
      user_type: user.user_type,
      phone: user.phone
    },
    tokens: {
      access: "mock_access_token",
      refresh: "mock_refresh_token"
    }
  };
};
