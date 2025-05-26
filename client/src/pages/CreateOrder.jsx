import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateOrder() {
  const [carModel, setCarModel] = useState('');
  const [issue, setIssue] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/vehicles', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setVehicles(data);
      } else {
        alert(data.error || 'Failed to fetch vehicles');
      }
    };

    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const requestBody = { car_model: carModel, issue, vehicle_id: selectedVehicle }; // Include vehicle_id

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();

      if (res.ok) {
        alert('Order created successfully');
        navigate('/orders'); // Redirect to the orders page
      } else {
        console.error('Error:', data);
        alert(data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the order');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 text-white flex items-center justify-center">
      <div className="bg-white text-black p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Order</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="vehicle" className="block text-sm font-medium mb-2">
              Select Vehicle (Number Plate)
            </label>
            <select
              id="vehicle"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.license_plate} - {vehicle.make} {vehicle.model} ({vehicle.year})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="carModel" className="block text-sm font-medium mb-2">
              Car Model
            </label>
            <input
              type="text"
              id="carModel"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="issue" className="block text-sm font-medium mb-2">
              Issue
            </label>
            <textarea
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
          </div>
          <div className="mb-4 text-sm text-black text-center font-semibold bg-yellow-100 rounded p-2">
            To cancel your order, please contact us at <b>+966 555 123 456</b>.
          </div>
          <button className="button-primary w-full">Create Order</button>
        </form>
      </div>
    </div>
  );
}

