import { useState } from 'react';

export default function RegisterSection({ openLoginModal }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact_number, setContactNumber] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, contact_number }),
    });
    const data = await res.json();
    if (res.ok) {
      if (openLoginModal) openLoginModal('Registration successful!');
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <section className="register-section">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="text" placeholder="Contact Number" value={contact_number} onChange={(e) => setContactNumber(e.target.value)} required />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
            className="mr-2"
            required
          />
          <label htmlFor="consent" className="text-sm">
            I have read and agree to the <a href="https://sdaia.gov.sa/en/SDAIA/about/Documents/Personal%20Data%20English%20V2-23April2023-%20Reviewed-.pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>Saudi Personal Data Protection Law</a> and consent to the processing of my personal data in accordance with its terms.
          </label>
        </div>
        <button type="submit" className="button-primary" disabled={!consent}>Register</button>
      </form>
    </section>
  );
}
