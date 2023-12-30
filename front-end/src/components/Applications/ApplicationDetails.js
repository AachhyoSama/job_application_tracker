import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/apiService";

const ApplicationDetails = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const [applicationDetails, setApplicationDetails] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        const fetchApplicationDetails = async () => {
            try {
                const response = await apiService.get(
                    `/applications/${applicationId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "ngrok-skip-browser-warning": "true",
                        },
                    }
                );

                setApplicationDetails(response.data.data);
            } catch (error) {
                console.error("Error fetching application details:", error);
            }
        };

        if (applicationId) {
            fetchApplicationDetails();
        }
    }, [applicationId]);

    return (
        <div>
            <button onClick={() => navigate("/applications")}>Back</button>
            {applicationDetails ? (
                <>
                    <h2>Application Details</h2>
                    <p>Applied Email: {applicationDetails.appliedEmail}</p>
                    <p>Applied Date: {applicationDetails.appliedDate}</p>
                    <p>Status: {applicationDetails.status}</p>
                    <p>
                        Rejected Date:{" "}
                        {applicationDetails.rejectedDate
                            ? applicationDetails.rejectedDate
                            : "N/A"}
                    </p>
                    <p>
                        Job: {applicationDetails.job.title} (
                        {applicationDetails.company.name})
                    </p>

                    <p>
                        Applied Link:{" "}
                        <a
                            href={applicationDetails.job.job_link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {applicationDetails.job.job_link}
                        </a>
                    </p>
                </>
            ) : (
                <p>Loading application details...</p>
            )}
        </div>
    );
};

export default ApplicationDetails;
