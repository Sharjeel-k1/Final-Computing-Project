import { useState } from 'react';

export default function EmailVerificationModal({ email, onClose, onVerify }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Call backend to verify email with code (token)
      const res = await fetch(`http://localhost:5000/api/auth/verify/${code}`);
      const data = await res.json();
      if (res.ok) {
        setSuccess('Email verified! You can now log in.');
        setTimeout(() => {
          onVerify();
        }, 1200);
      } else {
        setError(data.error || 'Verification failed');
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
        <h2 className="text-center text-3xl font-bold mb-6">Verify Your Email</h2>
        <p className="mb-2 text-center">A verification link has been sent to <b>{email}</b>.</p>
        <p className="mb-4 text-center">Paste the code from your email here:</p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Verification code (from email link)"
            className="w-full p-2 mb-3 border border-gray-300 rounded bg-[#222] text-white"
            required
          />
          {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
          {success && <div className="text-green-600 mb-2 text-center">{success}</div>}
          <div className="flex gap-2">
            <button type="submit" className="button-primary flex-1" disabled={loading}>{loading ? 'Verifying...' : 'Verify'}</button>
            <button type="button" className="button-secondary flex-1" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}
