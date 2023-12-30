import React from "react";
import "../../App.css";
import { Route, Routes } from "react-router-dom";
import SummaryCard from "./SummaryCard.js";
import { WelcomeComponent } from "../WelcomeComponent.js";

import CompanyList from "../Companies/CompanyList.js";
import JobList from "../Jobs/JobList.js";
import ApplicationList from "../Applications/ApplicationList.js";

import CompanyForm from "../Companies/CompanyForm.js";
import JobForm from "../Jobs/JobForm.js";
import ApplicationForm from "../Applications/ApplicationForm.js";

import CompanyDetails from "../Companies/CompanyDetails.js";
import JobDetails from "../Jobs/JobDetails.js";
import ApplicationDetails from "../Applications/ApplicationDetails.js";

const Dashboard = () => {
    return (
        <div>
            <SummaryCard />

            <div className="main-container">
                <Routes>
                    <Route path="/" element={<WelcomeComponent />} />
                    <Route path="/companies" element={<CompanyList />} />
                    <Route
                        path="/company-details/:companyId"
                        element={<CompanyDetails />}
                    />
                    <Route path="/jobs" element={<JobList />} />
                    <Route path="/applications" element={<ApplicationList />} />

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
    );
};

export default Dashboard;
