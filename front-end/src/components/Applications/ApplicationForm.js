import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/apiService";
import "../../App.css";

const ApplicationForm = () => {
    const [application, setApplication] = useState({
        appliedEmail: "",
        appliedDate: "",
        status: "",
        rejectedDate: "",
        jobId: "", // Added jobId for the job dropdown
    });

    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();
    const { applicationId } = useParams();

    useEffect(() => {
        // Fetch jobs from the API when the component mounts
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

        // If applicationId is provided, fetch and populate the form for editing
        if (applicationId) {
            fetchApplicationDetails();
        }
    }, [applicationId]);

    const fetchApplicationDetails = async () => {
        try {
            const response = await apiService.get(
                `/applications/${applicationId}`,
                {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                }
            );

            const applicationDetails = response.data.data;
            setApplication({
                appliedEmail: applicationDetails.appliedEmail,
                appliedDate: applicationDetails.appliedDate,
                status: applicationDetails.status,
                rejectedDate: applicationDetails.rejectedDate,
                jobId: applicationDetails.job._id, // Populate jobId from applicationDetails
            });
        } catch (error) {
            console.error("Error fetching application details:", error);
        }
    };

    const handleChange = (e) => {
        setApplication({ ...application, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const applicationPayLoad = {
                applicationData: {
                    appliedEmail: application.appliedEmail,
                    appliedDate: application.appliedDate,
                    status: application.status,
                    rejectedDate: application.rejectedDate,
                },
                jobId: application.jobId,
            };
            if (applicationId) {
                // If applicationId is provided, update existing application
                await apiService.put(
                    `/applications/${applicationId}`,
                    applicationPayLoad
                );
            } else {
                // Otherwise, create a new application
                await apiService.post("/applications", applicationPayLoad);
            }

            // Redirect to the application list after submission with success message as a query parameter
            navigate("/applications", {
                state: {
                    successMessage: applicationId
                        ? "Application updated successfully!"
                        : "Application added successfully!",
                },
            });
        } catch (error) {
            console.error("Error submitting application form:", error);
        }
    };

    return (
        <div>
            <button onClick={() => navigate("/applications")}>Back</button>
            <h2>
                {applicationId ? "Edit Application" : "Add New Application"}
            </h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Applied Email:
                    <input
                        type="email"
                        name="appliedEmail"
                        value={application.appliedEmail}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Applied Date:
                    <input
                        type="date"
                        name="appliedDate"
                        value={application.appliedDate}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Status:
                    <input
                        type="text"
                        name="status"
                        value={application.status}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Rejected Date (if rejected):
                    <input
                        type="date"
                        name="rejectedDate"
                        value={application.rejectedDate}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Job:
                    <select
                        name="jobId"
                        value={application.jobId}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select a job
                        </option>
                        {jobs.map((job) => (
                            <option key={job._id} value={job._id}>
                                {job.title} ({job.company.name})
                            </option>
                        ))}
                    </select>
                </label>
                {/* Add other fields as needed */}
                <button type="submit">
                    {applicationId ? "Update Application" : "Add Application"}
                </button>
            </form>
        </div>
    );
};

export default ApplicationForm;
