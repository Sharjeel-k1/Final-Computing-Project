import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // ✅ Detect if user was redirected after logout
  useEffect(() => {
    if (localStorage.getItem('logoutMessage')) {
      setMessage("You've been logged out. Please log in again.");
      localStorage.removeItem('logoutMessage');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      alert('Login successful');
      navigate('/');
    } else {
      alert(data.error || 'Login failed');
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-600 text-white">
        <form onSubmit={handleSubmit} className="bg-white text-black p-8 rounded shadow-md w-full max-w-md">

          {/* ✅ Logout message alert */}
          {message && (
              <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
                {message}
              </div>
          )}

          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

          <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 mb-4 border border-gray-300 rounded"
          />

          <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 mb-4 border border-gray-300 rounded"
          />

          <button className="button-primary w-full">Login</button>

          <p className="text-center mt-4">
            Don't have an account?{' '}
            <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/register')}>
            Register
          </span>
          </p>
        </form>
      </div>
  );
}
