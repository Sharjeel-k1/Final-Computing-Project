import { pool } from '../config/db.js';

// Get orders for the logged-in user
export const getOrders = async (req, res) => {
  const userId = req.user.userId; // Extract user ID from the token

  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.status(200).json({ orders: result.rows });
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  // Optionally, check if the user is an admin (if using admin JWTs)
  // For now, just return all orders
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.status(200).json({ orders: result.rows });
  } catch (err) {
    console.error('Error fetching all orders:', err.message);
    res.status(500).json({ error: 'Failed to fetch all orders', details: err.message });
  }
};

// Create a new order
export const createOrder = async (req, res) => {
  const { car_model, issue, number_plate } = req.body;
  const userId = req.user.userId; // Extract user ID from the token
  const customerName = req.user.name; // Extract customer name from the token

  if (!number_plate) {
    return res.status(400).json({ error: 'Number plate is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO orders (customer_name, car_model, issue, user_id, number_plate) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [customerName, car_model, issue, userId, number_plate]
    );
    res.status(201).json({ message: 'Order created successfully', orderId: result.rows[0].id });
  } catch (err) {
    console.error('Error creating order:', err.message);
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const validStatuses = ['Pending', 'In Progress', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        const result = await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: `Order ${id} updated to status ${status}`, order: result.rows[0] });
    } catch (err) {
        console.error('Error updating order status:', err.message);
        res.status(500).json({ error: 'Failed to update order status', details: err.message });
    }
};