import React, { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Production API Base URL Pointing to Deployed Render Instance
  const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://127.0.0.1:8000/api/activities/"
  : "/api/activities/"; // Relative path works automatically when hosted together on Render!

  const fetchDashboardData = () => {
    fetch(API_BASE)
      .then(res => {
        if (!res.ok) throw new Error("Could not connect to the remote Django backend Engine.");
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
          // Synchronize state mutations locally to cleanly match the audit backend properties
          setData(prev => prev.map(item => 
            item.id === id 
              ? { ...item, status: 'APPROVED', is_locked: true, approved_by: 'Lead_ESG_Analyst_01' } 
              : item
          ));
        } else {
          console.error("Backend audit footprint serialization rejected.");
        }
      })
      .catch(err => console.error("Network communication disruption:", err));
  };

  if (loading) return <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#4b5563' }}>Initializing Carbon Ledger Pipeline...</div>;
  if (error) return <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#dc2626', fontWeight: 'bold' }}>Error: {error} (Ensure Django Server is Active)</div>;

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
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#d97706', marginTop: '5px' }}>{data.filter(r => !r.is_locked).length} Alert Flags</div>
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
              <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s', backgroundColor: row.is_locked ? '#ffffff' : row.status === 'SUSPICIOUS' ? '#fffbeb' : '#ffffff' }}>
                
                {/* 1. Source Data Row Lookup Identifier */}
                <td style={{ padding: '16px 24px', fontFamily: 'monospace', color: '#475569', fontWeight: '500' }}>{row.source_row_identifier}</td>
                
                {/* 2. Scope Categorization Badge */}
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    backgroundColor: row.scope_category === '1' ? '#fee2e2' : row.scope_category === '2' ? '#e0f2fe' : '#f3e8ff', 
                    color: row.scope_category === '1' ? '#991b1b' : row.scope_category === '2' ? '#0369a1' : '#6b21a8', 
                    padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' 
                  }}>
                    Scope {row.scope_category}
                  </span>
                </td>
                
                {/* 3. Ingestion Metadata & Error Logs */}
                <td style={{ padding: '16px 24px', color: '#334155', fontWeight: '500' }}>
                  <div style={{ color: '#0f172a', fontWeight: '600', marginBottom: '4px' }}>{row.activity_type}</div>
                  
                  {row.flags_meta?.warning && (
                    <div style={{ fontSize: '12px', color: '#b45309', marginTop: '6px', backgroundColor: '#fdf8e6', padding: '10px', borderRadius: '6px', border: '1px solid #fef3c7' }}>
                      <span style={{ fontWeight: '700' }}>⚠️ Data Warning:</span> {row.flags_meta.warning}
                      {row.flags_meta?.raw_payload && (
                        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748b', marginTop: '4px', borderTop: '1px dashed #fcd34d', paddingTop: '4px' }}>
                          <span style={{ fontWeight: '700' }}>Raw Line Entry:</span> {row.flags_meta.raw_payload}
                        </div>
                      )}
                    </div>
                  )}
                </td>
                
                {/* 4. Normalized Quantity vs Raw Ingestion Quantities */}
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>
                    {parseFloat(row.normalized_quantity_kwh).toLocaleString(undefined, {minimumFractionDigits: 2})} kWh
                  </div>
                  {row.raw_quantity && (
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', fontWeight: '500' }}>
                      Original Input: {parseFloat(row.raw_quantity).toLocaleString()} {row.raw_unit}
                    </div>
                  )}
                </td>
                
                {/* 5. Live State Monitoring Trace */}
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '700', fontSize: '13px', color: row.is_locked ? '#16a34a' : row.status === 'SUSPICIOUS' ? '#d97706' : '#4b5563' }}>
                      ● {row.is_locked ? 'APPROVED' : row.status}
                    </span>
                    {row.approved_by && (
                      <span style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px', fontWeight: '500' }}>
                        Signed by: {row.approved_by}
                      </span>
                    )}
                  </div>
                </td>
                
                {/* 6. Functional Relational Audit Action Trigger */}
                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                  {!row.is_locked ? (
                    <button 
                      onClick={() => approveRow(row.id)} 
                      style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
                    >
                      Sign Off & Validate
                    </button>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      🔒 Verified & Locked
                    </span>
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