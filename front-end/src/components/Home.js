// Home.js
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="main-container">
            <h2>Welcome to Job Application Tracker</h2>
            <p>This is a your personal job application tracker.</p>
            <p>
                Please <Link to="/login">log in</Link> or{" "}
                <Link to="/register">register</Link> to get started.
            </p>
        </div>
    );
};

export default Home;
