import React, { useState } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    //write code for active link highlighting
    const [activeLink, setActiveLink] = useState('/');
    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    return (
        <nav className='navbar'>
            <div className='navbar-container'>
                <div className='logo'>
                    <span>Logo</span>
                </div>
                <div className='title'>
                    <span>Resume Ranker</span>
                </div>
                <div className='nav-links'>
                    <Link to={'/'} className={`link-btn ${activeLink === "home" ? 'active' : ''}`} onClick={() => handleLinkClick('home')}>Home</Link>
                    <Link to={'/search'} className={`link-btn ${activeLink === "search" ? 'active' : ''}`} onClick={() => handleLinkClick('search')}>Search</Link>
                </div>
                <div>
                    <button className='button'>Login</button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;