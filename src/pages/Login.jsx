import React, { useContext, useEffect, useState } from "react";
import Logo from '../assets/icons/logo.png'
import "../styles/login.css"; // custom CSS
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function Login() {
    const { user, login } = useAuth();
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
            const res = await login(username, password);
            console.log(res, "response")
            if (res && res.status === 200) {
                toast.success("login successfully");
                navigate("/")
            } else {
                console.log("error to log in");
                toast.error("login failed");
            }
            setError("");
        } catch (error) {
            setLoading(false);
            console.log("error", error);
            if (error) {
                toast.error(error.response.data.detail)
            } else {
                toast.error("Login failed");
            }
            setError("Error to login");
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
                            Login
                        </button>
                    </form>

                    <p className="signup-text">
                        Don’t have an account? <Link to="/register">Sign up</Link>
                    </p>
                </div>
            </div>

        </div>
    );
}
