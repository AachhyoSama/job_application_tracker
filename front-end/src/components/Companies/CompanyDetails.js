import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import { useParams } from "react-router-dom";

const CompanyDetails = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [companyDetails, setCompanyDetails] = useState(null);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                const response = await apiService.get(`/company/${companyId}`, {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                });
                setCompanyDetails(response.data.data);
            } catch (error) {
                console.error("Error fetching company details:", error);
            }
        };

        if (companyId) {
            fetchCompanyDetails();
        }
    }, [companyId]);

    return (
        <div className="single-element-details">
            <button onClick={() => navigate("/companies")}>Back</button>
            {companyDetails ? (
                <>
                    <h2>{companyDetails.name}</h2>
                    <p>
                        Location:{" "}
                        {`${companyDetails.location.address1}, 
                        ${companyDetails.location.city}, 
                        ${companyDetails.location.state}, 
                        ${companyDetails.location.zip}`}
                    </p>
                    <p>
                        Website:{" "}
                        <a
                            href={companyDetails.website}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {companyDetails.website}
                        </a>
                    </p>
                    <p>Email: {companyDetails.email}</p>
                    <p>Phone: {companyDetails.phone}</p>
                    <p>Industry: {companyDetails.industry.join(", ")}</p>
                    <p>Description: {companyDetails.description}</p>
                </>
            ) : (
                <p>Loading company details...</p>
            )}
        </div>
    );
};

export default CompanyDetails;
