import React, { useState } from 'react';

function UploadPage() {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem('uploadedItems') || '[]');
    const newItem = { name: itemName, price: parseFloat(price), unit };
    localStorage.setItem('uploadedItems', JSON.stringify([...existing, newItem]));
    setItemName('');
    setPrice('');
    setUnit('kg');
    alert('Item submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">📤 Submit a Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Egg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Procurement Price</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 9000"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="kg">kg</option>
              <option value="piece">piece</option>
              <option value="liter">liter</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;