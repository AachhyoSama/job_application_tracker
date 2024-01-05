import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import { useParams } from "react-router-dom";

const JobDetails = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [jobDetails, setJobDetails] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await apiService.get(`/jobs/${jobId}`, {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                });
                setJobDetails(response.data.data);
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        };

        if (jobId) {
            fetchJobDetails();
        }
    }, [jobId]);

    return (
        <div className="single-element-details">
            <button onClick={() => navigate("/jobs")}>Back</button>
            {jobDetails ? (
                <>
                    <h2>{jobDetails.title}</h2>
                    <p>Company: {jobDetails.company.name}</p>
                    <p>Job Office Location: {jobDetails.job_office_location}</p>
                    <p>Job Type: {jobDetails.job_type}</p>
                    <p>Description: {jobDetails.description}</p>
                    <p>Requirements: {jobDetails.requirements}</p>
                    <p>Qualifications: {jobDetails.qualifications}</p>
                    <p>Salary: {jobDetails.salary}</p>
                    <p>
                        Job Link:{" "}
                        <a
                            href={jobDetails.job_portal_link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {jobDetails.job_portal_link}
                        </a>
                    </p>
                </>
            ) : (
                <p>Loading job details...</p>
            )}
        </div>
    );
};

export default JobDetails;
