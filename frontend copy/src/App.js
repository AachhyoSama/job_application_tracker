import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import apiService from "./services/apiService.js";

import CompanyList from "./components/Companies/CompanyList.js";
import JobList from "./components/Jobs/JobList.js";
import ApplicationList from "./components/Applications/ApplicationList.js";

import CompanyForm from "./components/Companies/CompanyForm.js";
import JobForm from "./components/Jobs/JobForm.js";
import ApplicationForm from "./components/Applications/ApplicationForm.js";

import CompanyDetails from "./components/Companies/CompanyDetails.js";
import JobDetails from "./components/Jobs/JobDetails.js";
import ApplicationDetails from "./components/Applications/ApplicationDetails.js";

import { WelcomeComponent } from "./components/WelcomeComponent.js";

const App = () => {
    const [companyCount, setCompanyCount] = useState(0);
    const [jobCount, setJobCount] = useState(0);
    const [applicationCount, setApplicationCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
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
        <Router>
            <div className="dashboard">
                <header>
                    <div className="logo">
                        <Link to="/">Job Application Tracker</Link>
                    </div>
                </header>
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

                <div className="main-container">
                    <Routes>
                        <Route path="/" element={<WelcomeComponent />} />
                        <Route path="/companies" element={<CompanyList />} />
                        <Route
                            path="/company-details/:companyId"
                            element={<CompanyDetails />}
                        />
                        <Route path="/jobs" element={<JobList />} />
                        <Route
                            path="/applications"
                            element={<ApplicationList />}
                        />

                        <Route path="/add-company" element={<CompanyForm />} />
                        <Route
                            path="/edit-company/:companyId"
                            element={<CompanyForm />}
                        />

                        <Route path="/add-job" element={<JobForm />} />
                        <Route path="/edit-job/:jobId" element={<JobForm />} />
                        <Route
                            path="/job-details/:jobId"
                            element={<JobDetails />}
                        />

                        <Route
                            path="/add-application"
                            element={<ApplicationForm />}
                        />
                        <Route
                            path="/edit-application/:applicationId"
                            element={<ApplicationForm />}
                        />
                        <Route
                            path="/application-details/:applicationId"
                            element={<ApplicationDetails />}
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
