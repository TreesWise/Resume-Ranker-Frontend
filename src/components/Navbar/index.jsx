import React from 'react';
import './styles.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className='navbar'>
            <div className='navbar-container'>
                <div className='logo'>
                    <span>Logo</span>
                </div>
                <div className='title'>
                    <span>Resume Ranker</span>
                </div>
                <Link to={'/search'} className='login-button'>Search</Link>
                <div>
                    <button className='login-button'>Login</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;