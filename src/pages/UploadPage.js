import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadPage() {
  const [items, setItems] = useState([{ name: '', price: '', unit: '' }]);
  const navigate = useNavigate();

  const handleChange = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const handleAddRow = () => {
    setItems([...items, { name: '', price: '', unit: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('uploadedItems', JSON.stringify(items));
    navigate('/compare');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📥 Upload Procurement Data</h2>
      <form onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Name"
              value={item.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleChange(index, 'price', e.target.value)}
              className="p-2 border rounded"
              required
            />
            <select
              value={item.unit}
              onChange={(e) => handleChange(index, 'unit', e.target.value)}
              className="p-2 border rounded"
              required
            >
              <option value="">Select unit</option>
              <option value="kg">kg</option>
              <option value="piece">piece</option>
              <option value="liter">liter</option>
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddRow}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          ➕ Add Item
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          🚀 Submit
        </button>
      </form>
    </div>
  );
}

export default UploadPage;