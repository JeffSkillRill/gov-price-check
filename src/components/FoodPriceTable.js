import Papa from "papaparse";
import { useEffect, useState } from "react";

function FoodPriceTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse("/data/food_prices.csv", {
      download: true,
      header: true,
      complete: (result) => {
        // Add a mock procurement price to each item
        const enrichedData = result.data.map((item) => {
          const marketPrice = parseFloat(item.market_price);
          // Simulate procurement price as 10-50% more than market price
          const procurementPrice = marketPrice * (1 + Math.random() * 0.4);
          return { ...item, procurement_price: procurementPrice.toFixed(2) };
        });
        setData(enrichedData);
      },
    });
  }, []);

  const evaluatePrice = (market, procurement) => {
    if (!market || !procurement) return "N/A";
    const m = parseFloat(market);
    const p = parseFloat(procurement);
    if (p <= m * 1.1) return "✅ Reasonable";
    if (p <= m * 1.3) return "⚠️ Slightly High";
    return "❌ Overpriced";
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Food Prices</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Product</th>
            <th className="border px-2 py-1">Market Price</th>
            <th className="border px-2 py-1">Procurement Price</th>
            <th className="border px-2 py-1">Unit</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{item.product_name}</td>
              <td className="border px-2 py-1">{item.market_price}</td>
              <td className="border px-2 py-1">{item.procurement_price}</td>
              <td className="border px-2 py-1">{item.unit}</td>
              <td className="border px-2 py-1">
                {evaluatePrice(item.market_price, item.procurement_price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FoodPriceTable;