import axios from "axios";

const apiService = axios.create({
    baseURL: "https://d20e-73-202-73-158.ngrok-free.app/job-tracker",
});

export default apiService;