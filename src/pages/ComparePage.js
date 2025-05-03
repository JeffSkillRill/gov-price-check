import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function ComparePage() {
  const uploadedItems = JSON.parse(localStorage.getItem('uploadedItems') || '[]');
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    Papa.parse('/data/food_prices.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const enriched = result.data
          .map((item) => {
            const itemName = item['Name of product'];
            const unit = item['Units'];
            const rawMarket = item['Cost'];
            const marketPrice = parseFloat(rawMarket);

            if (!itemName || !unit || isNaN(marketPrice)) return null;

            const match = uploadedItems.find(
              (u) =>
                u.name.toLowerCase() === itemName.toLowerCase() &&
                u.unit.toLowerCase() === unit.toLowerCase()
            );

            if (!match) return null;

            const procurementPrice = parseFloat(match.price);
            if (isNaN(procurementPrice)) return null;

            return {
              name: itemName,
              unit,
              marketPrice,
              procurementPrice,
            };
          })
          .filter(Boolean);

        setMarketData(enriched);
      },
    });
  }, [uploadedItems]);

  const evaluate = (market, procurement) => {
    const over = ((procurement - market) / market) * 100;
    if (over <= 25) return '✅ Reasonable';
    if (over <= 30) return '❌ Overpriced';
    return '❌❌ Seriously Overpriced';
  };

  const getRowColor = (market, procurement) => {
    const over = ((procurement - market) / market) * 100;
    if (over <= 25) return 'bg-green-100';
    if (over <= 30) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Comparison Results</h2>

      <table className="w-full border text-left mb-8">
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
            <tr key={i} className={getRowColor(item.marketPrice, item.procurementPrice)}>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1">{item.marketPrice}</td>
              <td className="border px-2 py-1">{item.procurementPrice}</td>
              <td className="border px-2 py-1">{item.unit}</td>
              <td className="border px-2 py-1">
                {evaluate(item.marketPrice, item.procurementPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {marketData.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2">📈 Visual Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marketData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="marketPrice" fill="#82ca9d" name="Market Price" />
              <Bar dataKey="procurementPrice" fill="#ff7f7f" name="Procurement Price" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

const exportToPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Procurement Price Comparison Report", 14, 22);
  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

  const tableData = marketData.map((item) => [
    item.name,
    item.marketPrice,
    item.procurementPrice,
    item.unit,
    evaluate(item.marketPrice, item.procurementPrice),
  ]);

  doc.autoTable({
    head: [["Item", "Market Price", "Procurement Price", "Unit", "Status"]],
    body: tableData,
    startY: 40,
  });

  doc.save("price_comparison_report.pdf");
};

export default ComparePage;