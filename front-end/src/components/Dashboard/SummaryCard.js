import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from "../../services/apiService.js";

const SummaryCard = () => {
    const [companyCount, setCompanyCount] = useState(0);
    const [jobCount, setJobCount] = useState(0);
    const [applicationCount, setApplicationCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const companies = await apiService.get("/company", {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                });

                const jobs = await apiService.get("/jobs", {
                    headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
                });

                const applications = await apiService.get("/applications", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "ngrok-skip-browser-warning": "true",
                    },
                });

                setCompanyCount(companies.data.data.length);
                setJobCount(jobs.data.data.length);
                setApplicationCount(applications.data.data.length);
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };

        fetchCounts();
    }, []);

    return (
        <div className="dashboard-content">
            <div className="summary-card">
                <h3>Companies</h3>
                <p>Total Companies: {companyCount} </p>
                <Link to="/companies">View All Companies</Link>
            </div>

            <div className="summary-card">
                <h3>Jobs</h3>
                <p>Total Jobs: {jobCount} </p>
                <Link to="/jobs">View All Jobs</Link>
            </div>

            <div className="summary-card">
                <h3>Applications</h3>
                <p>Total Applications: {applicationCount} </p>
                <Link to="/applications">View All Applications</Link>
            </div>
        </div>
    );
};

export default SummaryCard;
