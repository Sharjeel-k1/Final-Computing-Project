import { useEffect, useState } from 'react';
import { getUserFromToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import '../admin.css';
import { LogOut } from 'lucide-react';

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.setItem('showLogin', 'true');
  localStorage.setItem('logoutMessage', 'true');
  window.location.href = '/';
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    // Optionally, check if the token is valid and user is admin
    // ...existing code...
  }, [navigate]);

  const user = {
    id: 'dev123',       /* I changed this so it doesnt give me problems for auth */
    name: 'Dev Admin',     /* change it back for the login backend logic */
    role: 'admin'
  };

  // Use real data, not mock data
  const useMockData = false;

  const MOCK_ORDERS = [
    {
      id: 1,
      customer_name: 'John Doe',
      car_model: 'Toyota Corolla',
      issue: 'Engine overheating',
      status: 'Pending',
      created_at: '2025-05-18T09:00:00Z',
    },
    {
      id: 2,
      customer_name: 'Jane Smith',
      car_model: 'BMW X5',
      issue: 'Brake failure',
      status: 'In Progress',
      created_at: '2025-05-17T14:30:00Z',
    },
    {
      id: 3,
      customer_name: 'Ali Khan',
      car_model: 'Ford Focus',
      issue: 'AC not cooling',
      status: 'Completed',
      created_at: '2025-05-15T11:15:00Z',
    },
  ];

  useEffect(() => {
    if (useMockData) {
      setOrders(MOCK_ORDERS);
    } else if (user && user.role === 'admin') {
      fetchOrders();
    }
  }, [user, useMockData]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/orders/all', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setOrders(data.orders || []);
  };

  const getStatusClass = (status) => {
    if (status === 'Pending') return 'status-badge status-pending';
    if (status === 'In Progress') return 'status-badge status-inprogress';
    return 'status-badge status-completed';
  };

  const total = orders.length;
  const pending = orders.filter(o => o.status === 'Pending').length;
  const inProgress = orders.filter(o => o.status === 'In Progress').length;
  const completed = orders.filter(o => o.status === 'Completed').length;

  const filteredOrders = orders
      .filter(order => (filter ? order.status === filter : true))
      .sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });

  return (
      <div className="admin-container">
        <nav className="admin-nav">
          <a href="/" className="nav-link">Home</a>
          <button className="nav-link logout-icon" onClick={handleLogout} title="Logout">
            <LogOut size={20} />
          </button>
        </nav>

        <h2 className="admin-title">Admin Dashboard</h2>

        {/* Stat Cards */}
        <div className="stats-container">
          <div className="stat-card bg-blue">Total Orders: {total}</div>
          <div className="stat-card bg-yellow">Pending: {pending}</div>
          <div className="stat-card bg-cyan">In Progress: {inProgress}</div>
          <div className="stat-card bg-green">Completed: {completed}</div>
        </div>

        {/* Filters */}
        <div className="controls">
          <select onChange={(e) => setFilter(e.target.value)} className="filter-dropdown">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select onChange={(e) => setSortOrder(e.target.value)} className="filter-dropdown">
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {!user || user.role !== 'admin' ? (
            <p className="auth-warning">
              🔒 You must be an admin to view order data. Log in to continue.
            </p>
        ) : (
            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                <tr>
                  <th>Customer</th>
                  <th>Car Model</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
                </thead>
                <tbody>
                {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-orders">No orders found.</td>
                    </tr>
                ) : (
                    filteredOrders.map((order) => (
                        <tr key={order.id} className="order-row" onClick={() => setSelectedOrder(order)}>
                          <td>{order.customer_name}</td>
                          <td>{order.car_model}</td>
                          <td>{order.issue}</td>
                          <td><span className={getStatusClass(order.status)}>{order.status}</span></td>
                          <td>{new Date(order.created_at).toLocaleString()}</td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
        )}

        {/* Modal */}
        {selectedOrder && (
            <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
              <div className="order-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Order Details</h3>
                <p><strong>Customer:</strong> {selectedOrder.customer_name}</p>
                <p><strong>Car Model:</strong> {selectedOrder.car_model}</p>
                <p><strong>Issue:</strong> {selectedOrder.issue}</p>
                <p><strong>Status:</strong> 
                  <select
                    value={selectedOrder.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      // Optimistically update UI
                      setSelectedOrder({ ...selectedOrder, status: newStatus });
                      // Update on server
                      const token = localStorage.getItem('token');
                      const res = await fetch(`http://localhost:5000/api/orders/${selectedOrder.id}/status`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: newStatus }),
                      });
                      if (res.ok) {
                        // Also update in the main orders list
                        setOrders((prev) => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
                      } else {
                        alert('Failed to update status');
                      }
                    }}
                    className="filter-dropdown"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </p>
                <p><strong>Created At:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                <button onClick={() => setSelectedOrder(null)} className="close-modal">Close</button>
              </div>
            </div>
        )}
      </div>
  );
}


// This code is a React component for an Admin Dashboard that displays a list of orders.
// It uses the useEffect hook to fetch orders from the server when the component mounts.    
// The fetchOrders function makes a GET request to the server with the user's token for authentication.
// The orders are displayed in a table format, with columns for customer name, car model, issue, status, and creation date.