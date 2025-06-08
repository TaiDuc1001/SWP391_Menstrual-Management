import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-item active">Chu Kỳ Của Tôi <span className="icon">💧</span></div>
            <button className="nav-button">Khái Bổ Chu Kỳ</button>
            <button className="nav-button">Triệu chứng <span className="icon">🍓</span></button>
            <button className="nav-button">Cài đặt <span className="icon">⚙️</span></button>
        </nav>
    );
};

export default Navbar;