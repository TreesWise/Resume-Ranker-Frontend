import axios from 'axios';
// Create an Axios instance
const apiUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
    baseURL: apiUrl,
});

api.interceptors.request.use(
    async (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export const signin = (username, password) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    return api.post("/login/", formData, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })

};

export const register = (username, password) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    return api.post("/signup/", formData, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

//Upload folder
export const uploadFolder = async (files) => {
    const formData = new FormData();
    for (const file of files) {
        formData.append('files', file);
    }

    try {
        const response = await api.post('/upload-folder/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('Error uploading folder:', error);
        throw error;
    }
};

//upload-jd
export const uploadJD = async (file, title) => {
    const formData = new FormData();
    formData.append('jd_file', file);
    formData.append('job_title', title);

    try {
        const response = await api.post('/upload-jd/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('Error uploading job description:', error);
        throw error;
    }
};

//Rank Resumes
export const rankResumes = async (criteria, jobTitle) => {
    try {
        const body = {
            criteria_with_weights: criteria,
            job_title: jobTitle,
        }
        const response = await api.post('/rank-resumes-dynamic/', body, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error('Error ranking resumes:', error);
        throw error;
    }
};

//Get Records
export const getRecords = async (jobTitle) => {
    try {
        const response = await api.get(`/get-records/?job_title=${encodeURIComponent(jobTitle)}`);
        return response;
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error;
    }
}

//get job roles
export const getJobRoles = async () => {
    try {
        const response = await api.get('/job-titles/');
        return response;
    } catch (error) {
        console.error('Error fetching job roles:', error);
        throw error;
    }
}