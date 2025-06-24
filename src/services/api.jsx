import axios from 'axios';
// Create an Axios instance
const apiUrl = import.meta.env.VITE_BASE_URL;

const api = axios.create({
    baseURL: apiUrl,
});

//Upload folder
export const uploadFolder = async (files, uploadedBy) => {
    const formData = new FormData();
    for (const file of files) {
        formData.append('files', file);
    }
    formData.append('uploaded_by', uploadedBy);

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
export const uploadJD = async (file, title, uploadedBy) => {
    const formData = new FormData();
    formData.append('jd_file', file);
    formData.append('job_title', title);
    formData.append('uploaded_by', uploadedBy);

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
export const rankResumes = async (criteria, jobTitle, name) => {
    try {
        const body = {
            criteria,
            uploaded_by: name,
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
export const getRecords = async (email, jobTitle) => {
    try {
        const response = await api.get(`/get-records/?job_title=${encodeURIComponent(jobTitle)}&email=${encodeURIComponent(email)}`);
        return response;
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error;
    }
}