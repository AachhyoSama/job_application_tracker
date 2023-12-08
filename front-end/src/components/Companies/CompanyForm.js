import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/apiService";
import "../../App.css";

const CompanyForm = () => {
    const [company, setCompany] = useState({
        name: "",
        location: "",
        website: "",
    });

    const navigate = useNavigate();
    const { companyId } = useParams();

    useEffect(() => {
        // If companyId is provided, fetch and populate the form for editing
        if (companyId) {
            fetchCompanyDetails();
        }
    }, [companyId]);

    const fetchCompanyDetails = async () => {
        try {
            const response = await apiService.get(`/company/${companyId}`, {
                headers: {
                    "ngrok-skip-browser-warning": "true",
                },
            });

            const companyDetails = response.data.data;
            setCompany({
                name: companyDetails.name,
                location: companyDetails.location,
                website: companyDetails.website,
            });
        } catch (error) {
            console.error("Error fetching company details:", error);
        }
    };

    const handleChange = (e) => {
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (companyId) {
                // If companyId is provided, update existing company
                await apiService.put(`/company/${companyId}`, company);
            } else {
                // Otherwise, create a new company
                await apiService.post("/company", company);
            }

            // Redirect to the company list after submission with success message as a query parameter
            navigate("/companies", {
                state: {
                    successMessage: companyId
                        ? "Company updated successfully!"
                        : "Company added successfully!",
                },
            });
        } catch (error) {
            console.error("Error submitting company form:", error);
        }
    };

    return (
        <div>
            <button onClick={() => navigate("/companies")}>Back</button>
            <h2>{companyId ? "Edit Company" : "Add New Company"}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Company Name:
                    <input
                        type="text"
                        name="name"
                        value={company.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={company.location}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Website:
                    <input
                        type="text"
                        name="website"
                        value={company.website}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">
                    {companyId ? "Update Company" : "Add Company"}
                </button>
            </form>
        </div>
    );
};

export default CompanyForm;
