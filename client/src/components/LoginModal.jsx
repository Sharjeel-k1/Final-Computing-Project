import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailVerificationModal from './EmailVerificationModal';
import TwoFAModal from './TwoFAModal';

export default function LoginModal({ closeModal, successMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFAUserId, setTwoFAUserId] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        closeModal();
        navigate('/');
      } else if (data.twoFactorRequired && data.userId) {
        setTwoFAUserId(data.userId);
        setShow2FA(true);
      } else if (data.error && data.error.toLowerCase().includes('verify')) {
        setPendingEmail(email);
        setShowVerify(true);
      } else {
        setErrorMessage('Email or password is wrong');
      }
    } catch (err) {
      setErrorMessage('Server error. Please try again.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      alert('Password reset email sent. Please check your inbox.');
      setShowForgotPasswordModal(false);
    } else {
      alert('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <>
      {show2FA ? (
        <TwoFAModal
          userId={twoFAUserId}
          onClose={() => setShow2FA(false)}
          onSuccess={() => {
            setShow2FA(false);
            closeModal();
            navigate('/');
          }}
        />
      ) : showVerify ? (
        <EmailVerificationModal
          email={pendingEmail}
          onClose={() => setShowVerify(false)}
          onVerify={() => {
            setShowVerify(false);
            closeModal();
            navigate('/');
          }}
        />
      ) : (
        <>
          {/* BACKDROP */}
          <div className="modal-backdrop" onClick={closeModal}></div>
          {/* SIDE PANEL */}
          <div className="login-side-panel">
            <span className="close-icon" onClick={closeModal}>&times;</span>
            {typeof successMessage === 'string' && successMessage && (
                <p className="text-green-500 text-center mb-4">{successMessage}</p>
            )}
            <h2 className="text-center text-3xl font-bold mb-4">Login</h2>
            {errorMessage && (
                <p className="text-red-500 text-center mb-4">{errorMessage}</p>
            )}
            <form onSubmit={handleSubmit}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button className="button-primary">Login</button>
            </form>
            <div className="text-center mt-4">
              <span onClick={() => setShowForgotPasswordModal(true)} className="login-link">
                Forgot Password?
              </span>
            </div>
          </div>
          {/* FORGOT PASSWORD OVERLAY */}
          {showForgotPasswordModal && (
              <div className="modal">
                <div className="modal-content forgot-password-modal">
                  <span className="close-icon" onClick={() => setShowForgotPasswordModal(false)}>&times;</span>
                  <h2 className="text-center text-3xl font-bold mb-4">Forgot Password</h2>
                  <form onSubmit={handleForgotPassword}>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <button className="button-primary">Send Reset Email</button>
                  </form>
                </div>
              </div>
          )}
        </>
      )}
    </>
  );
}
