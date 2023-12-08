import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import apiService from "../../services/apiService";

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Fetch jobs from your API when the component mounts
        const fetchJobs = async () => {
            try {
                const response = await apiService.get("/jobs", {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                });
                setJobs(response.data.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobs();
    }, [successMessage]);

    useEffect(() => {
        // Check for success message in the query parameters
        const successMessage = location.state?.successMessage;

        if (successMessage) {
            setSuccessMessage(successMessage);
        }

        // Cleanup function to clear success message when the component unmounts
        return () => {
            setSuccessMessage("");
        };
    }, [location.state?.successMessage]);

    const showJobDetails = (jobId) => {
        navigate(`/job-details/${jobId}`);
    };

    const goToAddJob = () => {
        navigate("/add-job");
    };

    const goToEditJob = (jobId) => {
        navigate(`/edit-job/${jobId}`);
    };

    const handleDeleteJob = async (jobId) => {
        try {
            // API to delete the job
            await apiService.delete(`/jobs/${jobId}`);
            setSuccessMessage("Job deleted successfully!");
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    return (
        <div>
            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}
            <div className="job-header">
                <h2>Jobs List</h2>
                <button className="add-job-btn" onClick={goToAddJob}>
                    Add New Job
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Salary</th>
                        <th>Job Link</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <tr key={job._id}>
                                <td>{job.title}</td>
                                <td>{job.company.name}</td>
                                <td>{job.location}</td>
                                <td>{job.salary}</td>
                                <td>
                                    <a
                                        href={job.job_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {job.job_link}
                                    </a>
                                </td>
                                <td>
                                    <button
                                        onClick={() => showJobDetails(job._id)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faEye}
                                            title="View"
                                        />
                                    </button>
                                    <button
                                        onClick={() => goToEditJob(job._id)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            title="Edit"
                                        />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteJob(job._id)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            title="Delete"
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No jobs available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default JobList;
