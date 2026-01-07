const ACCESS_TOKEN_KEY = 'access-token';
const USER_KEY = 'user';

export const getAccessToken = () => sessionStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (accessToken) => {
    if (accessToken) {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }
};

export const clearAccessToken = () => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const getUser = () => {
    const userStr = sessionStorage.getItem(USER_KEY);
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }
    return null;
};

export const setUser = (user) => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearUser = () => {
    sessionStorage.removeItem(USER_KEY);
};

export const clearAuth = () => {
    clearAccessToken();
    clearUser();
};

export const hasValidAuth = () => {
    return !!getAccessToken() && !!getUser();
};
