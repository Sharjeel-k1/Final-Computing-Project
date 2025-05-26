import { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterSection from './RegisterSection';
import CreateOrderModal from './CreateOrderModal';

export default function Navbar({ openLogin, scrollToRegister, openCreateOrder }) {
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <nav className="navbar">
            <div className="navbar-center">
                <a href="/" className="navbar-link">Home</a>
                {token ? (
                    <>
                        <a href="/orders" className="navbar-link">Orders</a>
                        <span onClick={openCreateOrder} className="navbar-link">Create Order</span>
                        <a href="/" onClick={handleLogout} className="navbar-link">Logout</a>
                    </>
                ) : (
                    <>
                        <span onClick={openLogin} className="navbar-link" style={{cursor: 'pointer'}}>Login</span>
                        <span onClick={scrollToRegister} className="navbar-link" style={{cursor: 'pointer'}}>Register</span>
                    </>
                )}
            </div>
        </nav>
    );
}
