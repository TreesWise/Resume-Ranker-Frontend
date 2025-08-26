import React, { useState } from "react";
import Logo from '../assets/icons/logo.png'
import "../styles/login.css"; // custom CSS

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        console.log("Logging in:", { email, password });
        setError("");
    };

    return (
        <div className="login-container">
            {/* Left Side with Background Image */}
            <div className="login-left"></div>

            {/* Right Side with Form */}
            <div className="login-right">
                <div className="form-wrapper">
                    <div className="logo-container">
                        <img src={Logo} className="img" />
                    </div>
                

                    {error && <div className="error-box">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-login">
                            Login
                        </button>
                    </form>

                    <p className="signup-text">
                        Don’t have an account? <a href="/register">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
