import React from "react";
import { useNavigate } from "react-router-dom";

function Account() {
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Logging out...");
        navigate("/");
    };

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
            <h1>My Account</h1>
            
            <div style={{ marginBottom: "30px" }}>
                <h2>Profile Information</h2>
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>Email:</strong> johndoe@umd.edu</p>
                <p><strong>Student ID:</strong> 12345678</p>
            </div>
            
            <div style={{ marginBottom: "30px" }}>
                <h2>Activity</h2>
                <p><strong>Items Found:</strong> 5</p>
                <p><strong>Items Lost:</strong> 2</p>
                <p><strong>Successful Matches:</strong> 3</p>
            </div>
            
            <div>
                <h2>Account Settings</h2>
                <button 
                    onClick={handleLogout}
                    style={{ 
                        padding: "10px 20px", 
                        backgroundColor: "#e21833", 
                        color: "white", 
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Account;