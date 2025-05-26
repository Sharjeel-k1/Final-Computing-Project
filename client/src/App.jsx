import { useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import VerifyEmailPage from './pages/VerifyEmailPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import CreateOrderModal from './components/CreateOrderModal';
import LoginOrRegisterModal from './components/LoginOrRegisterModal';

export default function App() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showLoginOrRegister, setShowLoginOrRegister] = useState(false);

    const registerRef = useRef(null);

    const openLogin = (message = '') => {
        setSuccessMessage(message);
        setIsLoginOpen(true);
    };
    const closeLogin = () => setIsLoginOpen(false);

    const openCreateOrder = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setShowLoginOrRegister(true);
        } else {
            setIsCreateOrderOpen(true);
        }
    };
    const closeCreateOrder = () => setIsCreateOrderOpen(false);

    const scrollToRegister = () => {
        registerRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const isAdminRoute = location.pathname.startsWith('/admin');
    const [loginMessage, setLoginMessage] = useState('');


    return (
        <BrowserRouter>
            {!isAdminRoute && (
                <Navbar
                openLogin={openLogin}
                scrollToRegister={scrollToRegister}
                openCreateOrder={openCreateOrder}
            />
            )}
            {showLoginOrRegister && (
                <LoginOrRegisterModal
                    onClose={(action) => {
                        setShowLoginOrRegister(false);
                        if (action === 'login') openLogin();
                        if (action === 'register') scrollToRegister();
                    }}
                />
            )}
            <Routes>
                <Route
                    path="/"
                    element={
                        <Home
                            openCreateOrder={openCreateOrder}
                            registerRef={registerRef}
                            openLogin={openLogin}
                            setLoginMessage={setLoginMessage}
                        />
                    }
                />
                <Route path="/orders" element={<Orders />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            </Routes>
            {!isAdminRoute && <Footer />}
            {isLoginOpen && (
                <LoginModal closeModal={closeLogin} successMessage={successMessage} />
            )}
            {isCreateOrderOpen && (
                <CreateOrderModal closeModal={closeCreateOrder} />
            )}
        </BrowserRouter>
    );
}
