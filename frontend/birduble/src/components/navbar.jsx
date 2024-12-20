import React, { useState, useEffect } from 'react';
import '../styles/navbar.css';

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 120);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleProfileClick = () => {
        // Profil resmine tıklandığında #login kısmına gitmek için
        window.location.href = '#login';
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log('Arama:', searchTerm);
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-top">
                <div className="profile" onClick={handleProfileClick}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/6522/6522516.png"
                        alt="profile"
                    />
                </div>
                {!isScrolled && <div className="site-title">Birduble</div>}
                <div className="empty"></div>

                {isScrolled && (
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Ara..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                )}
            </div>
            {!isScrolled && (
                <div className="searchbox">
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Malzemeleri arayın..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </form>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
