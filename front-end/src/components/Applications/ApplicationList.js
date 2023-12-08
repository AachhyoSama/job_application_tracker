import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiService from "../../services/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

const formatDate = (inputDate) => {
    const [day, month, year] = inputDate.split("/");
    const formattedDate = new Date(
        `${year}-${month}-${day}`
    ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    return formattedDate;
};

const ApplicationList = () => {
    const [applications, setApplications] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Fetch applications from your API when the component mounts
        const fetchApplications = async () => {
            try {
                const response = await apiService.get("/applications", {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                });
                setApplications(response.data.data);
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        fetchApplications();
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

    const goToEditApplication = (applicationId) => {
        navigate(`/edit-application/${applicationId}`);
    };

    const handleDeleteApplication = async (applicationId) => {
        try {
            // API to delete the application
            await apiService.delete(`/applications/${applicationId}`);
            setSuccessMessage("Application deleted successfully!");
        } catch (error) {
            console.error("Error deleting application:", error);
        }
    };

    const goToViewApplication = (applicationId) => {
        navigate(`/application-details/${applicationId}`);
    };

    const goToAddApplication = () => {
        navigate("/add-application");
    };

    return (
        <div>
            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}
            <div className="application-header">
                <h2>Applications List</h2>
                <button
                    className="add-application-btn"
                    onClick={goToAddApplication}
                >
                    Add New Application
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Applied Email</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                        <th>Rejected Date</th>
                        <th>Job (Company)</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.length > 0 ? (
                        applications.map((application) => (
                            <tr key={application._id}>
                                <td>{application.appliedEmail}</td>
                                <td>{formatDate(application.appliedDate)}</td>
                                <td>{application.status}</td>
                                <td>
                                    {application.rejectedDate
                                        ? formatDate(application.rejectedDate)
                                        : "N/A"}
                                </td>
                                <td>
                                    {application.job.title} (
                                    {application.company.name})
                                </td>
                                <td>
                                    <button
                                        onClick={() =>
                                            goToViewApplication(application._id)
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faEye}
                                            title="View"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            goToEditApplication(application._id)
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            title="Edit"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteApplication(
                                                application._id
                                            )
                                        }
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
                            <td colSpan="6">
                                You haven't applied to any job yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ApplicationList;
