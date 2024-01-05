import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import apiService from "../../services/apiService";
import "../../App.css";

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
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

    const showCompanyDetails = (companyId) => {
        navigate(`/company-details/${companyId}`);
    };

    const goToAddCompany = () => {
        navigate("/add-company");
    };

    const goToEditCompany = (companyId) => {
        navigate(`/edit-company/${companyId}`);
    };

    const handleDeleteCompany = async (companyId) => {
        try {
            // API to delete the company
            await apiService.delete(`/company/${companyId}`);
            setSuccessMessage("Company deleted successfully!");
        } catch (error) {
            console.error("Error deleting company:", error);
        }
    };

    return (
        <div>
            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}
            <div className="company-header">
                <h2>Company List</h2>
                <button className="add-company-btn" onClick={goToAddCompany}>
                    Add New Company
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Location</th>
                        <th>Website</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.length > 0 ? (
                        companies.map((company) => (
                            <tr key={company._id}>
                                <td>{company.name}</td>
                                <td>
                                    {`${company.location.address1}, 
                                        ${company.location.city}, 
                                        ${company.location.state}, 
                                        ${company.location.zip}`}
                                </td>
                                <td>
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {company.website}
                                    </a>
                                </td>
                                <td>{company.email}</td>
                                <td>{company.phone}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            showCompanyDetails(company._id)
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faEye}
                                            title="View"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            goToEditCompany(company._id)
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            title="Edit"
                                        />
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeleteCompany(company._id)
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
                            <td colSpan="6">No companies available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CompanyList;
