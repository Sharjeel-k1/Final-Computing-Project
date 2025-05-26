import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../admin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="admin-login-bg">
      <div className="admin-login-center">
        <div className="admin-login-card">
          <h2 className="admin-login-title">Admin Login</h2>
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-login-field">
              <label className="admin-login-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="admin-login-input"
                autoFocus
              />
            </div>
            <div className="admin-login-field">
              <label className="admin-login-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="admin-login-input"
              />
            </div>
            {error && <div className="admin-login-error">{error}</div>}
            <button className="admin-login-button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}
