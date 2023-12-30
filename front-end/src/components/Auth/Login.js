import React, { useState } from "react";
import apiService from "../../services/apiService";
import "../../App.css";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await apiService.post("/auth/login", formData);
            console.log(response.data);

            // th API response has a "token" property
            const { token } = response.data.data;

            // Store the token in local storage
            localStorage.setItem("jwtToken", token);

            // Update the app state to reflect the user's logged-in status
            setIsLoggedIn(true);

            // You can redirect the user to a different page if needed
            navigate("/");
        } catch (error) {
            console.error("Error logging in user:", error);

            // Set the error state to display the error message
            setError("Invalid email or password. Please try again.");

            // You can handle login failure here (e.g., show error message)
        }
    };

    return (
        <div className="main-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <br />

                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <br />

                {error && <div className="error-message">{error}</div>}

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
