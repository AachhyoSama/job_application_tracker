import axios from "axios";

const apiService = axios.create({
    baseURL: "https://4718-2601-644-2-cc0-00-d0a5.ngrok-free.app/job-tracker",
});

export default apiService;
