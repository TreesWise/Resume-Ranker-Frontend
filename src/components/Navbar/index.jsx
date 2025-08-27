import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/icons/logo.png'; // Assuming you have a logo image
import DownIcon from "../../assets/icons/down-icon.svg";
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    //write code for active link highlighting
    const [activeLink, setActiveLink] = useState('/');
    const [settings, setSettings] = useState(false);
    const { user, logout } = useAuth();
    const dropdownRef = useRef(null);
    const settingsRef = useRef(null);

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };
    const handleClickSettings = () => {
        setSettings(!settings);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // if click is outside settings container → close
            if (settingsRef.current && !settingsRef.current.contains(event.target) && !dropdownRef.current.contains(event.target)) {
                setSettings(false);
            }
        };

        if (settings) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // cleanup
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [settings]);

    return (
        <nav className='navbar'>
            <div className='navbar-container'>
                <div className='logo'>
                    <img src={logo} alt='Logo' />
                </div>
                <div className='title'>
                    <span>Resume Ranker</span>
                </div>
                <div className='nav-links'>
                    <Link to={'/'} className={`link-btn ${activeLink === "home" ? 'active' : ''}`} onClick={() => handleLinkClick('home')}>Home</Link>
                    <Link to={'/search'} className={`link-btn ${activeLink === "search" ? 'active' : ''}`} onClick={() => handleLinkClick('search')}>Search</Link>
                </div>
                {
                    user ? <div className='user-info'>
                        <span>Hii {user.charAt(0).toUpperCase()+ user.slice(1)}</span>
                        <div className='settings' ref={dropdownRef}>
                            <img src={DownIcon} className='icon' onClick={handleClickSettings} />
                            {
                                settings && <div ref={settingsRef}>
                                    <button className='button danger' onClick={logout}>Logout</button>
                                </div>
                            }
                        </div>


                    </div>
                        : <div>
                            <button className='button'>Login</button>
                        </div>}

            </div>
        </nav>
    )
}

export default Navbar;