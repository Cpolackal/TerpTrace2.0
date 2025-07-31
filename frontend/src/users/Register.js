import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        studentId: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Registration data:", formData);
        navigate("/login");
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        required
                    />
                </div>
                
                <div style={{ marginBottom: "15px" }}>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        required
                    />
                </div>
                
                <div style={{ marginBottom: "15px" }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        required
                    />
                </div>
                
                <div style={{ marginBottom: "15px" }}>
                    <label>Student ID:</label>
                    <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        required
                    />
                </div>
                
                <div style={{ marginBottom: "15px" }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                        required
                    />
                </div>
                
                <button 
                    type="submit"
                    style={{ 
                        width: "100%", 
                        padding: "10px", 
                        backgroundColor: "#e21833", 
                        color: "white", 
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;