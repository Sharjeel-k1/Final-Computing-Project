import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const navigate = useNavigate();

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/verify/${token}`);
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }
    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 text-white">
      <div className="bg-white text-black p-8 rounded shadow-md w-full max-w-md text-center">
        {status === 'verifying' && <p>Verifying your email...</p>}
        {status === 'success' && <p>Email verified! Redirecting to home...</p>}
        {status === 'error' && <p className="text-red-600">Verification failed. Please try again or contact support.</p>}
      </div>
    </div>
  );
}
