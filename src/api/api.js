import axios from 'axios';
import { getAccessToken, clearAuth } from '@/utils/tokenStorage';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://edlas.lolskins.gg/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (config.skipAuth) {
            return config;
        }

        const token = getAccessToken();
        if (token && typeof token === 'string' && token.trim() !== '') {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !error.config?.skipAuth) {
            // clearAuth();
            // window.location.href = '/login';
        }
        // return Promise.reject(error);
        return error;
    }
);

const baseRequest = async ({
    url,
    method = 'GET',
    body = null,
    params = null,
    contentType = 'application/json',
    signal,
    skipAuth = false,
}) => {
    const requestConfig = {
        method,
        url,
        data: body,
        params,
        signal,
        skipAuth,
    };

    if (body && contentType) {
        requestConfig.headers = { 'Content-Type': contentType };
    }

    try {
        const response = await axiosInstance(requestConfig);
        return {
            data: response.data,
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            statusText: response.statusText,
        };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                data: error.response.data,
                ok: false,
                status: error.response.status,
                statusText: error.response.statusText,
            };
        }
        throw error;
    }
};

export const authAPI = {
    login: (email, password) =>
        baseRequest({
            url: '/system/auth/login/',
            method: 'POST',
            body: { email, password },
            skipAuth: true,
        }),

    googleLogin: (idToken) =>
        baseRequest({
            url: '/system/auth/google-login/',
            method: 'POST',
            body: { id_token: idToken },
            skipAuth: true,
        }),

    register: (userData) =>
        baseRequest({
            url: '/system/auth/register/user/',
            method: 'POST',
            body: userData,
            skipAuth: true,
        }),

    logout: () =>
        baseRequest({
            url: '/system/auth/logout/',
            method: 'GET',
        }),

    whoami: () =>
        baseRequest({
            url: '/system/auth/whoami/',
            method: 'GET',
        }),

    verifyEmail: (email, verificationCode) =>
        baseRequest({
            url: '/system/auth/verify-email/',
            method: 'POST',
            body: { email, verification_code: verificationCode },
            skipAuth: true,
        }),

    resendVerification: (email) =>
        baseRequest({
            url: '/system/auth/resend-verification/',
            method: 'POST',
            body: { email },
            skipAuth: true,
        }),
};

export const studentsAPI = {
    list: (params = {}) =>
        baseRequest({
            url: '/system/students/',
            method: 'GET',
            params,
        }),

    getById: (id) =>
        baseRequest({
            url: `/system/students/${id}/`,
            method: 'GET',
        }),

    create: (studentData) =>
        baseRequest({
            url: '/system/students/',
            method: 'POST',
            body: studentData,
        }),

    update: (id, studentData) =>
        baseRequest({
            url: `/system/students/${id}/`,
            method: 'PUT',
            body: studentData,
        }),

    partialUpdate: (id, studentData) =>
        baseRequest({
            url: `/system/students/${id}/`,
            method: 'PATCH',
            body: studentData,
        }),

    delete: (id) =>
        baseRequest({
            url: `/system/students/${id}/`,
            method: 'DELETE',
        }),

    updateStatus: (id, status) =>
        baseRequest({
            url: `/system/students/${id}/status/`,
            method: 'PATCH',
            body: { status },
        }),

    bulkPlacement: (studentIds, action, targetClass, targetSection) =>
        baseRequest({
            url: '/system/students/placement/',
            method: 'POST',
            body: {
                student_ids: studentIds,
                action,
                target_class: targetClass,
                target_section: targetSection,
            },
        }),
};

export const usersAPI = {
    list: (params = {}) =>
        baseRequest({
            url: '/system/users/',
            method: 'GET',
            params,
        }),

    getById: (id) =>
        baseRequest({
            url: `/system/users/${id}/`,
            method: 'GET',
        }),
};

export const classSectionsAPI = {
    list: (params = {}) =>
        baseRequest({
            url: '/academics/class-sections/',
            method: 'GET',
            params,
        }),

    getById: (id) =>
        baseRequest({
            url: `/academics/class-sections/${id}/`,
            method: 'GET',
        }),

    create: (sectionData) =>
        baseRequest({
            url: '/academics/class-sections/',
            method: 'POST',
            body: sectionData,
        }),

    update: (id, sectionData) =>
        baseRequest({
            url: `/academics/class-sections/${id}/`,
            method: 'PUT',
            body: sectionData,
        }),

    partialUpdate: (id, sectionData) =>
        baseRequest({
            url: `/academics/class-sections/${id}/`,
            method: 'PATCH',
            body: sectionData,
        }),

    delete: (id) =>
        baseRequest({
            url: `/academics/class-sections/${id}/`,
            method: 'DELETE',
        }),
};

export const classroomsAPI = {
    list: (params = {}) =>
        baseRequest({
            url: '/academics/classrooms/',
            method: 'GET',
            params,
        }),

    getById: (id) =>
        baseRequest({
            url: `/academics/classrooms/${id}/`,
            method: 'GET',
        }),

    create: (classroomData) =>
        baseRequest({
            url: '/academics/classrooms/',
            method: 'POST',
            body: classroomData,
        }),

    update: (id, classroomData) =>
        baseRequest({
            url: `/academics/classrooms/${id}/`,
            method: 'PUT',
            body: classroomData,
        }),

    partialUpdate: (id, classroomData) =>
        baseRequest({
            url: `/academics/classrooms/${id}/`,
            method: 'PATCH',
            body: classroomData,
        }),

    delete: (id) =>
        baseRequest({
            url: `/academics/classrooms/${id}/`,
            method: 'DELETE',
        }),
};

export const subjectsAPI = {
    list: (params = {}) =>
        baseRequest({
            url: '/academics/subjects/',
            method: 'GET',
            params,
        }),

    getById: (id) =>
        baseRequest({
            url: `/academics/subjects/${id}/`,
            method: 'GET',
        }),

    create: (subjectData) =>
        baseRequest({
            url: '/academics/subjects/',
            method: 'POST',
            body: subjectData,
        }),

    update: (id, subjectData) =>
        baseRequest({
            url: `/academics/subjects/${id}/`,
            method: 'PUT',
            body: subjectData,
        }),

    partialUpdate: (id, subjectData) =>
        baseRequest({
            url: `/academics/subjects/${id}/`,
            method: 'PATCH',
            body: subjectData,
        }),

    delete: (id) =>
        baseRequest({
            url: `/academics/subjects/${id}/`,
            method: 'DELETE',
        }),
};

export default {
    auth: authAPI,
    students: studentsAPI,
    users: usersAPI,
    classSections: classSectionsAPI,
    classrooms: classroomsAPI,
    subjects: subjectsAPI,
};
