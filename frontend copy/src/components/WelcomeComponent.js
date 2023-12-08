import React from "react";
import { useNavigate } from "react-router-dom";

export const WelcomeComponent = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Welcome to the Job Applied Tracker!</h2>
            <p>
                This is your personal dashboard to track companies, jobs, and
                applications.
            </p>

            <button onClick={() => navigate("/companies")}>Companies</button>
            <button onClick={() => navigate("/jobs")}>Jobs</button>
            <button onClick={() => navigate("/applications")}>
                My Applications
            </button>
        </div>
    );
};
