import React from 'react';
import { TECHNICAL_SPECIFICATIONS } from '@/data/specifications';
import '../styles/comparison.css';

export default function ComparisonPage() {
  return (
    <div className="comparison-page">
      <section className="comparison-hero">
        <div className="hero-content">
          <span className="badge">Full Technical Analysis</span>
          <h1>Fabric F64 <span className="highlight">vs</span> The World</h1>
          <p>Comparing Microsoft Fabric F64 against Azure Dedicated SQL Pool (DWU1000c) and Azure Databricks.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary">View Analysis</button>
            <button className="btn btn-outline">Sizing Guide</button>
          </div>
        </div>
      </section>

      <section className="verdict-section">
        <div className="verdict-content">
          <h2>The Verdict: <span className="highlight">Technical Equivalence</span></h2>
          <p className="verdict-text">
            <strong>Fabric F64</strong> is the modern capacity equivalent to <strong>DWU1000c</strong> for SQL warehousing and maps to a <strong>Medium (24 DBU)</strong> Databricks SQL Warehouse.
          </p>

          <div className="platform-cards">
            <div className="platform-card fabric">
              <div className="card-icon">⚡</div>
              <h3>Microsoft Fabric</h3>
              <div className="card-spec">
                <span className="label">Capacity</span>
                <span className="value">F64</span>
              </div>
              <div className="card-spec">
                <span className="label">Capacity Units</span>
                <span className="value">64 CUs</span>
              </div>
              <div className="card-spec">
                <span className="label">Spark vCores</span>
                <span className="value">128 (Base) - 384 (Burst)</span>
              </div>
              <div className="card-spec">
                <span className="label">Scaling</span>
                <span className="value">Bursting (3x)</span>
              </div>
              <div className="card-spec">
                <span className="label">Est. Cost</span>
                <span className="value">~$8,409/mo</span>
              </div>
            </div>

            <div className="platform-card synapse">
              <div className="card-icon">🔷</div>
              <h3>Azure SQL Pool</h3>
              <div className="card-spec">
                <span className="label">Equivalence</span>
                <span className="value">Direct Match</span>
              </div>
              <div className="card-spec">
                <span className="label">For SQL Warehousing</span>
              </div>
            </div>

            <div className="platform-card databricks">
              <div className="card-icon">🔶</div>
              <h3>Azure Databricks</h3>
              <div className="card-spec">
                <span className="label">Equivalence</span>
                <span className="value">Medium Warehouse</span>
              </div>
              <div className="card-spec">
                <span className="label">For SQL Workloads</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="specifications-section">
        <div className="specs-content">
          <h2>Comprehensive Specifications</h2>
          <p>A detailed side-by-side comparison of technical metrics across all three platforms.</p>

          <div className="table-wrapper">
            <table className="specifications-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="fabric-col">Microsoft Fabric (F64)</th>
                  <th className="synapse-col">Azure SQL Pool (DWU1000c)</th>
                  <th className="databricks-col">Azure Databricks (Medium)</th>
                </tr>
              </thead>
              <tbody>
                {TECHNICAL_SPECIFICATIONS.map((row, idx) => (
                  <tr key={idx}>
                    <td className="feature-name">{row.feature}</td>
                    <td className="fabric-col">{row.fabric}</td>
                    <td className="synapse-col">{row.synapse}</td>
                    <td className="databricks-col">{row.databricks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Size Your Workload?</h2>
        <p>Use our interactive sizing guide to get personalized recommendations.</p>
        <button className="btn btn-primary btn-large">Start Sizing Guide</button>
      </section>
    </div>
  );
}
