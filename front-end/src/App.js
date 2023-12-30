import React, { useState, useEffect } from "react";
import "./App.css";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
    Navigate,
} from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard.js";
import Register from "./components/Auth/Register.js";
import Login from "./components/Auth/Login.js";
import Home from "./components/Home.js";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check for token on app load
    useEffect(() => {
        const storedToken = localStorage.getItem("jwtToken");
        if (storedToken) {
            setIsLoggedIn(true);
        }
        setIsLoading(false); // Set loading to false once the check is done
    }, []);

    const handleLogout = () => {
        // Remove token from local storage
        localStorage.removeItem("jwtToken");
        // Update state to reflect logout
        setIsLoggedIn(false);
    };

    if (isLoading) {
        // Display a loading indicator while checking for the token
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className="job-tracker-app">
                <header>
                    <div className="logo">
                        <Link to="/">Job Application Tracker</Link>
                    </div>

                    <nav>
                        <ul>
                            {!isLoggedIn && (
                                <>
                                    <li>
                                        <Link to="/register">Register</Link>
                                    </li>
                                    <li>
                                        <Link to="/login">Login</Link>
                                    </li>
                                </>
                            )}

                            {isLoggedIn && (
                                <li>
                                    {/* Call handleLogout when Logout is clicked */}
                                    <Link to="/" onClick={handleLogout}>
                                        Logout
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                </header>

                <div className="dashboard">
                    <Routes>
                        {/* Render Home component at /home route */}
                        <Route path="/home" element={<Home />} />
                        <Route
                            path="/*"
                            element={
                                !isLoggedIn ? (
                                    // Render Home component when not logged in
                                    <Navigate to="/home" />
                                ) : (
                                    // Render Dashboard component when logged in
                                    <Dashboard setIsLoggedIn={setIsLoggedIn} />
                                )
                            }
                        />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/login"
                            element={<Login setIsLoggedIn={setIsLoggedIn} />}
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
