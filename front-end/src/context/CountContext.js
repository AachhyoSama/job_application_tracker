import React, { createContext, useContext, useState } from "react";
import apiService from "../services/apiService";

const CountContext = createContext();

export const CountProvider = ({ children }) => {
    const [countState, setCountState] = useState({
        companyCount: 0,
        jobCount: 0,
        applicationCount: 0,
    });

    const updateCounts = async () => {
        try {
            // Fetch counts from the server or wherever you get them
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

            setCountState({
                companyCount: companies.data.data.length,
                jobCount: jobs.data.data.length,
                applicationCount: applications.data.data.length,
            });
        } catch (error) {
            console.error("Error fetching counts:", error);
        }
    };

    const contextValue = {
        countState,
        updateCounts,
    };

    return (
        <CountContext.Provider value={contextValue}>
            {children}
        </CountContext.Provider>
    );
};

export const useCount = () => {
    return useContext(CountContext);
};
