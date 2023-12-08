import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/apiService";
import "../../App.css";

const JobForm = () => {
    const [job, setJob] = useState({
        title: "",
        job_type: "",
        salary: "",
        location: "",
        description: "",
        requirements: "",
        job_link: "",
        companyId: "",
    });

    const [companies, setCompanies] = useState([]); // State to store the list of companies
    const navigate = useNavigate();
    const { jobId } = useParams();

    useEffect(() => {
        // Fetch companies from the API when the component mounts
        const fetchCompanies = async () => {
            try {
                const response = await apiService.get("/company", {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                });
                setCompanies(response.data.data);
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };

        fetchCompanies();

        // If jobId is provided, fetch and populate the form for editing
        if (jobId) {
            fetchJobDetails();
        }
    }, [jobId]);

    const fetchJobDetails = async () => {
        try {
            const response = await apiService.get(`/jobs/${jobId}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });

            const jobDetails = response.data.data;
            setJob({
                title: jobDetails.title,
                job_type: jobDetails.job_type,
                salary: jobDetails.salary,
                location: jobDetails.location,
                description: jobDetails.description,
                requirements: jobDetails.requirements,
                job_link: jobDetails.job_link,
                companyId: jobDetails.company._id, // Populate companyId from jobDetails
            });
        } catch (error) {
            console.error("Error fetching job details:", error);
        }
    };

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const jobPayload = {
                jobData: {
                    title: job.title,
                    job_type: job.job_type,
                    salary: job.salary,
                    location: job.location,
                    description: job.description,
                    requirements: job.requirements,
                    job_link: job.job_link,
                },
                companyId: job.companyId,
            };

            if (jobId) {
                // If jobId is provided, update existing job
                await apiService.put(`/jobs/${jobId}`, jobPayload);
            } else {
                // Otherwise, create a new job
                await apiService.post("/jobs", jobPayload);
            }

            // Redirect to the job list after submission with success message as a query parameter
            navigate("/jobs", {
                state: {
                    successMessage: jobId
                        ? "Job updated successfully!"
                        : "Job added successfully!",
                },
            });
        } catch (error) {
            console.error("Error submitting job form:", error);
        }
    };

    return (
        <div>
            <button onClick={() => navigate("/jobs")}>Back</button>
            <h2>{jobId ? "Edit Job" : "Add New Job"}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Job Title:
                    <input
                        type="text"
                        name="title"
                        value={job.title}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Company:
                    <select
                        name="companyId"
                        value={job.companyId}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select a company
                        </option>
                        {companies.map((company) => (
                            <option key={company._id} value={company._id}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Job Type (Full Time / Part Time/ Internship, etc):
                    <input
                        type="text"
                        name="job_type"
                        value={job.job_type}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={job.location}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Salary (In USD):
                    <input
                        type="text"
                        name="salary"
                        value={job.salary}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Job Link:
                    <input
                        type="text"
                        name="job_link"
                        value={job.job_link}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Description:
                    <textarea
                        name="description"
                        value={job.description}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Requirements:
                    <textarea
                        name="requirements"
                        value={job.requirements}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit">
                    {jobId ? "Update Job" : "Add Job"}
                </button>
            </form>
        </div>
    );
};

export default JobForm;
