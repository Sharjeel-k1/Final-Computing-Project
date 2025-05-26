import { useState } from 'react';
import '../index.css'
export default function TwoFAModal({ userId, onClose, onSuccess }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        onSuccess();
      } else {
        setError(data.error || 'Invalid code');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content create-order-modal">
        <span className="close-icon" onClick={onClose}>&times;</span>
        <h2 className="text-center text-3xl font-bold mb-6">Two-Factor Authentication</h2>
        <p className="mb-2 text-center">A 6-digit code has been sent to your email.</p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Enter 2FA code"
            className="w-full p-2 mb-3 border border-gray-300 rounded bg-[#000] text-white"
            required
            maxLength={6}
          />
          {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
          <div className="flex button-row">
            <button type="submit" className="button-primary flex-1" disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</button>
            <button type="button" className="button-secondary flex-1" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}
