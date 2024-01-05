import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/apiService";

const CompanyForm = () => {
    const [company, setCompany] = useState({
        name: "",
        location: {
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: "",
        },
        website: "",
        phone: "",
        email: "",
        description: "",
        industry: [],
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
                phone: companyDetails.phone,
                email: companyDetails.email,
                description: companyDetails.description,
                industry: companyDetails.industry,
            });
        } catch (error) {
            console.error("Error fetching company details:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCompany((prevCompany) => ({
            ...prevCompany,
            [name]: value,
        }));
    };

    const handleIndustryChange = (e) => {
        const { value } = e.target;
        const industryArray = value.split(",").map((item) => item.trim());

        setCompany((prevCompany) => ({
            ...prevCompany,
            industry: industryArray,
        }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setCompany((prevCompany) => ({
            ...prevCompany,
            location: {
                ...prevCompany.location,
                [name]: value,
            },
        }));
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
                        name="address1"
                        value={company.location.address1}
                        onChange={handleLocationChange}
                        placeholder="Address 1"
                        required
                    />
                    <input
                        type="text"
                        name="address2"
                        value={company.location.address2}
                        onChange={handleLocationChange}
                        placeholder="Address 2"
                    />
                    <input
                        type="text"
                        name="city"
                        value={company.location.city}
                        onChange={handleLocationChange}
                        placeholder="City"
                        required
                    />
                    <input
                        type="text"
                        name="state"
                        value={company.location.state}
                        onChange={handleLocationChange}
                        placeholder="State"
                        required
                    />
                    <input
                        type="text"
                        name="zip"
                        value={company.location.zip}
                        onChange={handleLocationChange}
                        placeholder="Zip"
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
                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={company.phone}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="text"
                        name="email"
                        value={company.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        name="description"
                        value={company.description}
                        onChange={handleChange}
                        required
                        rows={4} // Set the number of rows as needed
                    />
                </label>
                <label>
                    Industry:
                    <input
                        type="text"
                        name="industry"
                        value={company.industry}
                        onChange={handleChange}
                        placeholder="Separate industries with commas"
                        onBlur={handleIndustryChange}
                        required
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
