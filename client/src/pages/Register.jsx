import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailVerificationModal from '../components/EmailVerificationModal';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [showVerify, setShowVerify] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInfoMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, contact_number: contactNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegisteredEmail(email);
        setShowVerify(true);
        setInfoMessage('Registration successful! Please check your email to verify your account.');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 text-white">
      {showVerify ? (
        <EmailVerificationModal
          email={registeredEmail}
          onClose={() => setShowVerify(false)}
          onVerify={() => navigate('/login')}
        />
      ) : (
        <form onSubmit={handleSubmit} className="bg-white text-black p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
          {infoMessage && <div className="text-green-600 text-center mb-4">{infoMessage}</div>}
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="text"
            id="contactNumber"
            name="contactNumber"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={e => setContactNumber(e.target.value)}
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mr-2"
              required
            />
            <label htmlFor="consent" className="text-sm">I agree to the terms and conditions and consent to data processing.</label>
          </div>
          <button className="button-primary w-full" disabled={!consent}>Register</button>
          <p className="text-center mt-4">
            Already have an account?{' '}
            <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/login')}>
              Login
            </span>
          </p>
        </form>
      )}
    </div>
  );
}