import axios from "axios"

// ✅ Backend base URLs
const BASE_URL = "http://localhost:3000";
const IMAGE_BASE_URL = `${BASE_URL}/uploads/`;

const Api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
});

Api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }

);

function objectToFormData(obj, formData = new FormData(), parentKey = "") {
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        const formKey = parentKey ? `${parentKey}[${key}]` : key;

        if (value instanceof File) {
            formData.append(formKey, value);
        }
        else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                const arrayKey = `${formKey}[${index}]`;
                if (typeof item === "object" && !(item instanceof File)) {
                    objectToFormData(item, formData, arrayKey);
                } else {
                    formData.append(arrayKey, item);
                }
            });

        }
        else if (typeof value === "object" && value !== null) {
            objectToFormData(value, formData, formKey);
        }
        else {
            formData.append(formKey, value);
        }
    });

    return formData;
}

Api.interceptors.request.use((config) => {
    if (config.data) {
        const hasFile = Object.values(config.data).some(
            (value) => value instanceof File
        );
        if (hasFile) {
            config.data = objectToFormData(config.data);
            delete config.headers["Content-Type"];
        }
    }
    return config;

});

Api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // 401/403 - Session invalid or blocked
            if (error.response.status === 401 || error.response.status === 403) {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("users");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

const sessionStore = (token, user) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("users", JSON.stringify(user));
}

const sessionRemove = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("users");
}

export { Api,IMAGE_BASE_URL, sessionStore, sessionRemove };
