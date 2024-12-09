import React from 'react';
import '../styles/footer.css';
import { FaClipboard, FaHome, FaHeart, FaUser } from "react-icons/fa";

function Footer() {
    return (
        <div className="footer">
            <div className="footer-item">
                <a href='/#home'>
                    <FaHome />
                    <span>Home</span>
                </a>
            </div>
            <div className="footer-item">
                <a href='/#kiler'>
                    <FaClipboard />
                    <span>Kiler</span>
                </a>
            </div>
            <div className="footer-item">
                <a href='/#available'>
                    <FaHeart />
                    <span>reçete</span>
                </a>
            </div>
            <div className="footer-item">
                <a href='/#profile'>
                    <FaUser />
                    <span>Profile</span>
                </a>
            </div>
        </div>
    );
}

export default Footer;
