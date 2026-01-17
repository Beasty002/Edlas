const ACCESS_TOKEN_KEY = 'access-token';
const USER_KEY = 'user';


export const setAccessToken = (accessToken) => {if(accessToken){ localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)}};
export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const removeAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

export const setUser = (user) => {if(user){ localStorage.setItem(USER_KEY, JSON.stringify(user))}};
export const getUser = () => JSON.parse(localStorage.getItem(USER_KEY));
export const removeUser = () => localStorage.removeItem(USER_KEY);

export const removeAuthData = () => {
    removeAccessToken();
    removeUser();
}

export const hasValidAuth = () => {
    return !!getAccessToken() && !!getUser();
}

