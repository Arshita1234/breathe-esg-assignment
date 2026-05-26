import React, { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "https://breathe-esg-assignment-2pxp.onrender.com/api/activities/";

  const fetchDashboardData = () => {
    fetch(API_BASE)
      .then(res => {
        if (!res.ok) throw new Error("Could not connect to Django backend Engine.");
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const approveRow = (id) => {
    fetch(`${API_BASE}${id}/approve/`, { method: 'POST' })
      .then(res => {
        if (res.ok) {
          setData(prev => prev.map(item => item.id === id ? { ...item, status: 'APPROVED' } : item));
        }
      });
  };

  if (loading) return <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#4b5563' }}>Initializing Carbon Ledger Pipeline...</div>;
  if (error) return <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#dc2626', fontWeight: 'bold' }}>Error: {error} (Ensure Django runserver is active)</div>;

  return (
    <div style={{ padding: '40px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* Upper Summary Metrics Area */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>Breathe ESG Analyst Data Console</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '0' }}>Multi-Tenant Isolation & Source Data Lineage Validation System Audit Ledger.</p>
      </div>

      {/* Realtime KPI Metadata Metrics Row */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>TOTAL ACTIVE RECORDS</span>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', marginTop: '5px' }}>{data.length} Rows</div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>PENDING REVIEW FLAGS</span>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#d97706', marginTop: '5px' }}>{data.filter(r => r.status !== 'APPROVED').length} Alert Flags</div>
        </div>
      </div>

      {/* Main Dynamic Table Database Register Grid */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 24px', fontWeight: '600', color: '#64748b' }}>Source Identifier</th>
              <th style={{ padding: '16px 24px', fontWeight: '600', color: '#64748b' }}>GHG Categorization</th>
              <th style={{ padding: '16px 24px', fontWeight: '600', color: '#64748b' }}>Activity Description Specification</th>
              <th style={{ padding: '16px 24px', fontWeight: '600', color: '#64748b' }}>Normalized Quantity</th>
              <th style={{ padding: '16px 24px', fontWeight: '600', color: '#64748b' }}>System Status</th>
              <th style={{ padding: '16px 24px', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Audit Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s', backgroundColor: row.status === 'SUSPICIOUS' ? '#fffbeb' : '#ffffff' }}>
                <td style={{ padding: '16px 24px', fontFamily: 'monospace', color: '#475569', fontWeight: '500' }}>{row.source_row_identifier}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ backgroundColor: row.scope_category === '1' ? '#fee2e2' : '#e0f2fe', color: row.scope_category === '1' ? '#991b1b' : '#0369a1', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' }}>
                    Scope {row.scope_category}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', color: '#334155', fontWeight: '500' }}>{row.activity_type}</td>
                <td style={{ padding: '16px 24px', fontWeight: '600', color: '#0f172a' }}>{parseFloat(row.normalized_quantity_kwh).toLocaleString()} kWh</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '700', fontSize: '13px', color: row.status === 'APPROVED' ? '#16a34a' : row.status === 'SUSPICIOUS' ? '#d97706' : '#4b5563' }}>
                      ● {row.status}
                    </span>
                    {row.flags_meta?.warning && (
                      <span style={{ fontSize: '11px', color: '#b45309', marginTop: '4px', fontStyle: 'italic' }}>
                        ⚠️ {row.flags_meta.warning}
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  {row.status !== 'APPROVED' ? (
                    <button onClick={() => approveRow(row.id)} style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                      Sign Off & Validate
                    </button>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>Verified & Locked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}