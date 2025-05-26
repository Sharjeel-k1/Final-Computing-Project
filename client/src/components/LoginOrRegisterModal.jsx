import { useEffect } from 'react';
import '../index.css'
export default function LoginOrRegisterModal({ onClose }) {
  useEffect(() => {
    // Prevent background scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="modal">
      <div className="modal-content create-order-modal text-center" style={{minWidth: '400px', maxWidth: '600px'}}>
        <span className="close-icon" onClick={() => onClose(null)}>&times;</span>
        <h2 className="text-3xl font-bold mb-4">Login or Register Required</h2>
        <p className="mb-4">You must be logged in to book an appointment.</p>
        <div className="button-row mt-0" style={{alignItems: 'stretch'}}>
          <button className="button-primary flex-1" onClick={() => { onClose('login'); }}>Login</button>
          <button className="button-secondary flex-1" onClick={() => { onClose('register'); }}>Register</button>
          <button className="text-gray-500 underline flex-1 bg-transparent border-0" style={{height: 'auto', minHeight: '48px'}} onClick={() => onClose(null)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
