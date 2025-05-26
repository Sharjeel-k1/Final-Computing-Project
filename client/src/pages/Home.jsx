import { useEffect } from 'react'; // ✅ Add this import at the top
import RegisterSection from '../components/RegisterSection';
import Map from '../components/Map';
import { getUserFromToken } from '../utils/auth';

export default function Home({ openCreateOrder, registerRef, openLogin, setLoginMessage }) {
    // ✅ Add this effect to auto-trigger login modal
    useEffect(() => {
        if (localStorage.getItem('logoutMessage')) {
            setLoginMessage("You've been logged out. Please log in again.");
            openLogin();
            localStorage.removeItem('logoutMessage');
        }
    }, []);

    const user = getUserFromToken();

    return (
        <>
            <div className="home-header">
                <div>
                    <h1 className="hero-title">Salman Car Workshop</h1>
                    <p className="text-lg text-white mb-6">Your trusted partner for car repair and maintenance.</p>
                    <button onClick={openCreateOrder} className="button-primary">Book an Appointment</button>
                </div>
            </div>

            <div className="container">
                <div className="card">
                    <h2>Our Services</h2>
                    <p>We offer a wide range of services, including diagnostics, repairs, and maintenance.</p>
                </div>
                <div className="card">
                    <h2>Why Choose Us?</h2>
                    <p>Experienced mechanics, transparent pricing, and excellent customer service.</p>
                </div>
            </div>

            {!user && (
                <div ref={registerRef}>
                    <RegisterSection openLoginModal={openLogin} />
                </div>
            )}

            <Map />
        </>
    );
}
