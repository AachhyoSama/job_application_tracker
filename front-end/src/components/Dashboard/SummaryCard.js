import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCount } from "../../context/CountContext";

const SummaryCard = () => {
    const { countState, updateCounts } = useCount();

    useEffect(() => {
        // Call updateCounts when the component mounts
        updateCounts();
    }, [updateCounts]);

    return (
        <div className="dashboard-content">
            {/* ... (existing code) */}
            <div className="summary-card">
                <h3>Companies</h3>
                <p>Total Companies: {countState.companyCount} </p>
                <Link to="/companies">View All Companies</Link>
            </div>

            <div className="summary-card">
                <h3>Jobs</h3>
                <p>Total Jobs: {countState.jobCount} </p>
                <Link to="/jobs">View All Jobs</Link>
            </div>

            <div className="summary-card">
                <h3>Applications</h3>
                <p>Total Applications: {countState.applicationCount} </p>
                <Link to="/applications">View All Applications</Link>
            </div>
        </div>
    );
};

export default SummaryCard;
