import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/apiService";
import "../../App.css";

const JobForm = () => {
    const [job, setJob] = useState({
        title: "",
        job_office_location: "",
        job_type: "",
        description: "",
        requirements: "",
        qualifications: "",
        salary: "",
        job_portal_link: "",
        company_id: "",
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
                job_office_location: jobDetails.job_office_location,
                job_type: jobDetails.job_type,
                description: jobDetails.description,
                requirements: jobDetails.requirements,
                qualifications: jobDetails.qualifications,
                salary: jobDetails.salary,
                job_portal_link: jobDetails.job_portal_link,
                company_id: jobDetails.company._id, // Populate company_id from jobDetails
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
                job_data: {
                    title: job.title,
                    job_office_location: job.job_office_location,
                    job_type: job.job_type,
                    description: job.description,
                    requirements: job.requirements,
                    qualifications: job.qualifications,
                    salary: job.salary,
                    job_portal_link: job.job_portal_link,
                },
                company_id: job.company_id,
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
                        name="company_id"
                        value={job.company_id}
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
                    Job Type:
                    <select
                        name="job_type"
                        value={job.job_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select Job Type
                        </option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                    </select>
                </label>

                <label>
                    Job Office Location:
                    <input
                        type="text"
                        name="job_office_location"
                        value={job.job_office_location}
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
                    Job Portal Link:
                    <input
                        type="text"
                        name="job_portal_link"
                        value={job.job_portal_link}
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
                        rows={4}
                    />
                </label>

                <label>
                    Requirements:
                    <textarea
                        name="requirements"
                        value={job.requirements}
                        onChange={handleChange}
                        required
                        rows={4}
                    />
                </label>

                <label>
                    Qualifications:
                    <textarea
                        name="qualifications"
                        value={job.qualifications}
                        onChange={handleChange}
                        required
                        rows={4}
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
