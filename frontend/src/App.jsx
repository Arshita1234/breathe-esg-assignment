import React, { useState, useEffect } from 'react';

// Automatically maps to local port or relative live paths depending on environment
const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://127.0.0.1:8000/api/activities/"
  : "/api/activities/";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
    fetch(API_BASE)
      .then(res => {
        const contentType = res.headers.get("content-type");
        if (!res.ok || (contentType && contentType.includes("text/html"))) {
          throw new Error("API returned non-JSON data.");
        }
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Using sandbox fallback mock matrix arrays:", err.message);
        setData([
          {
            id: 1,
            source_row_identifier: "SAP-EX-9402",
            scope_category: "1",
            activity_type: "Procurement: WERKS-0442 / Diesel Fuel Bulk Receipt",
            normalized_quantity_kwh: 894500.00,
            raw_quantity: 75000.00,
            raw_unit: "Liters",
            status: "SUSPICIOUS",
            is_locked: false,
            flags_meta: { warning: "Inconsistent units detected." }
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Loading Audit Ledger Matrix...</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h2>Breathe ESG Carbon Ledger Console</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
        <thead>
          <tr style={{ backgroundColor: '#e9ecef' }}>
            <th>Identifier</th>
            <th>Scope</th>
            <th>Activity Description</th>
            <th>Raw Qty</th>
            <th>Normalized Qty (kWh)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td>{row.source_row_identifier}</td>
              <td>Scope {row.scope_category}</td>
              <td>{row.activity_type}</td>
              <td>{row.raw_quantity} {row.raw_unit}</td>
              <td>{parseFloat(row.normalized_quantity_kwh).toLocaleString()} kWh</td>
              <td style={{ fontWeight: 'bold', color: row.status === 'SUSPICIOUS' ? 'red' : 'green' }}>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;