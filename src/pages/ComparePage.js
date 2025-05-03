import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

function ComparePage() {
  const uploadedItems = JSON.parse(localStorage.getItem('uploadedItems') || '[]');
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    Papa.parse("/data/food_prices.csv", {
      download: true,
      header: true,
      complete: (result) => {
        console.log("Parsed CSV:", result.data); // <-- ADD THIS LINE
  
        const enriched = result.data
          .map((item) => {
            const rawMarket = item["Cost"]; // Make sure this matches your CSV header
            const marketPrice = parseFloat(rawMarket);
            if (!item["Name of product"] || !item["Units"] || isNaN(marketPrice)) {
              return null;
            }
            const procurementPrice = marketPrice * (1 + Math.random() * 0.4);
            return {
              name: item["Name of product"],
              unit: item["Units"],
              marketPrice: marketPrice.toFixed(2),
              procurementPrice: procurementPrice.toFixed(2),
            };
          })
          .filter(Boolean);
          const matchedItems = enriched.filter((marketItem) =>
            uploadedItems.some((uploaded) =>
              uploaded.name.toLowerCase() === marketItem.name.toLowerCase()
            )
          );
          setMarketData(matchedItems);      },
    });
  }, []);

  const evaluate = (market, procurement) => {
    const m = parseFloat(market);
    const p = parseFloat(procurement);
    if (!m || !p) return "N/A";
    
    const over = ((p - m) / m) * 100;
  
    if (over <= 25) return "✅ Reasonable";
    if (over <= 30) return "❌ Overpriced";
    return "❌❌ Seriously Overpriced";
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Comparison Results</h2>
      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Item</th>
            <th className="border px-2 py-1">Market Price</th>
            <th className="border px-2 py-1">Procurement Price</th>
            <th className="border px-2 py-1">Unit</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {marketData.map((item, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1">{item.marketPrice} sum</td>
              <td className="border px-2 py-1">{item.procurementPrice} sum</td>
              <td className="border px-2 py-1">{item.unit}</td>
              <td className="border px-2 py-1">{evaluate(item.marketPrice, item.procurementPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComparePage;