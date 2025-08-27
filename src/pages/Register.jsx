import React, { useEffect, useState } from "react";
import Logo from '../assets/icons/logo.png'
import "../styles/login.css";
import { register } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const { user } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError("Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            const res = await register(username, password);

            if (res && res.status === 200) {
                toast.success("Registered successfully");
                navigate("/login")
            } else {
                console.log("error to log in");
                toast.error("error to register");
            }

            setError("");
        } catch (error) {
            setLoading(false);
            console.log(error);
            if (error.response.data.detail) {
                toast.error(error.response.data.detail)
            } else if (error) {
                console.log(error);
            } else {
                toast.error("error to register");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {
                loading && <div className='loading-overlay'>
                    <div className='loading-spinner'></div>
                </div>
            }
            <div className="login-left">
                <div className="container"></div>
                <div className="form-wrapper">
                    <h1>Resume Ranker</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                placeholder="Enter your Username"
                                onChange={(e) => setUsername(e.target.value)}
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
                        {error && <div className="error-box">{error}</div>}
                        <button type="submit" className="btn-login">
                            Register
                        </button>
                    </form>

                    <p className="signup-text">
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
