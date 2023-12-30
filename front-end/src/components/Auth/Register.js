import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import "../../App.css";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        address: "",
        role: "user",
    });
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await apiService.post("/auth/register", formData);
            console.log(response.data);

            navigate("/login");
        } catch (error) {
            console.error("Error registering user:", error);

            // Set the error state to display the error message
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div className="main-container">
            <h2>Register</h2>
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

                <label>First Name:</label>
                <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                />
                <br />

                <label>Last Name:</label>
                <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                />
                <br />

                <label>Address:</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
                <br />

                {error && <div className="error-message">{error}</div>}

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
