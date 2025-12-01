import React, { useState } from 'react';
import { SizingConfig } from '@/types';
import { calculateSizing } from '@/utils/calculations';
import { getDefaultWorkloadProfile } from '@/data/workloads';
import { getDefaultRegion, getDefaultGeo, GEOGRAPHIES, getRegionsByGeo } from '@/data/regions';
import { WORKLOAD_PROFILES } from '@/data/workloads';
import { REGIONS } from '@/data/regions';
import '../styles/sizing-guide.css';

export default function SizingGuidePage() {
  const [selectedGeo, setSelectedGeo] = useState<string>(getDefaultGeo());
  const [filteredRegions, setFilteredRegions] = useState(getRegionsByGeo(getDefaultGeo()));
  const [config, setConfig] = useState<SizingConfig>({
    dataVolumeGB: 2048,
    concurrentUsers: 50,
    workloadProfile: getDefaultWorkloadProfile(),
    region: getDefaultRegion(),
    pricingModel: 'on-demand',
    queryComplexity: 'complex',
    ingestionType: 'batch',
  });

  const handleGeoChange = (geo: string) => {
    setSelectedGeo(geo);
    const regions = getRegionsByGeo(geo);
    setFilteredRegions(regions);
    // Set region to first region in the selected geo
    if (regions.length > 0) {
      setConfig({ ...config, region: regions[0] });
    }
  };

  const result = calculateSizing(config);

  const handleDataVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, dataVolumeGB: parseInt(e.target.value) || 0 });
  };

  const handleConcurrentUsersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, concurrentUsers: parseInt(e.target.value) || 0 });
  };

  const handleWorkloadChange = (workloadId: string) => {
    const workload = WORKLOAD_PROFILES.find(w => w.id === workloadId);
    if (workload) {
      setConfig({ ...config, workloadProfile: workload });
    }
  };

  const handleRegionChange = (regionId: string) => {
    const region = REGIONS.find(r => r.id === regionId);
    if (region) {
      setConfig({ ...config, region });
    }
  };

  const handlePricingModelChange = (model: any) => {
    setConfig({ ...config, pricingModel: model });
  };

  const formatCurrency = (value: number, symbol: string = '$') => {
    return `${symbol}${value.toFixed(2)}`;
  };

  return (
    <div className="sizing-guide-page">
      <section className="sizing-hero">
        <h1>Sizing Scenario</h1>
        <p>Recommendation for a mid-sized enterprise workload with high concurrency requirements.</p>
      </section>

      <section className="sizing-controls">
        <div className="controls-grid">
          <div className="control-group">
            <label>Data Volume (GB)</label>
            <input
              type="number"
              value={config.dataVolumeGB}
              onChange={handleDataVolumeChange}
              min="1"
              max="512000"
            />
            <span className="control-hint">{(config.dataVolumeGB / 1024).toFixed(2)} TB</span>
          </div>

          <div className="control-group">
            <label>Concurrent Users</label>
            <input
              type="number"
              value={config.concurrentUsers}
              onChange={handleConcurrentUsersChange}
              min="1"
              max="1000"
            />
          </div>

          <div className="control-group">
            <label>Workload Profile</label>
            <select value={config.workloadProfile.id} onChange={(e) => handleWorkloadChange(e.target.value)}>
              {WORKLOAD_PROFILES.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Geography</label>
            <select value={selectedGeo} onChange={(e) => handleGeoChange(e.target.value)}>
              {GEOGRAPHIES.map(geo => (
                <option key={geo} value={geo}>{geo}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Region</label>
            <select value={config.region.id} onChange={(e) => handleRegionChange(e.target.value)}>
              {filteredRegions.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Pricing Model</label>
            <select value={config.pricingModel} onChange={(e) => handlePricingModelChange(e.target.value)}>
              <option value="on-demand">On-Demand</option>
              <option value="reserved">Reserved (30% off)</option>
              <option value="spot">Spot (50% off)</option>
              <option value="hybrid">Hybrid Mix</option>
            </select>
          </div>

          <div className="control-group">
            <label>Query Complexity</label>
            <select value={config.queryComplexity} onChange={(e) => setConfig({ ...config, queryComplexity: e.target.value as any })}>
              <option value="simple">Simple</option>
              <option value="complex">Complex</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary">Export to PDF</button>
      </section>

      <section className="recommendations-section">
        <div className="recommendations-grid">
          {/* Minimum Viable */}
          <div className="recommendation-card minimum">
            <h3>Minimum Viable</h3>
            <p className="tier-description">Cost-effective, but risky for concurrency</p>
            <div className="sku-list">
              <div className="sku-item fabric">
                <span className="sku-name">F32</span>
                <span className="sku-price">{formatCurrency(result.fabric.monthlyPrice * 0.5)}/mo</span>
              </div>
              <div className="sku-item synapse">
                <span className="sku-name">DWU500c</span>
                <span className="sku-price">{formatCurrency(result.synapse.monthlyPrice * 0.5)}/mo</span>
              </div>
              <div className="sku-item databricks">
                <span className="sku-name">Small (12 DBU)</span>
                <span className="sku-price">{formatCurrency(result.databricks.monthlyPrice * 0.5)}/mo</span>
              </div>
            </div>
            <ul className="benefits-list">
              <li className="warning">⚠️ May struggle with 50 concurrent refreshes</li>
              <li className="success">✓ Sufficient for 2TB storage</li>
              <li className="warning">⚠️ Databricks: Heavy queuing likely</li>
            </ul>
            <button className="btn btn-outline">Show Details</button>
          </div>

          {/* Recommended (Balanced) */}
          <div className="recommendation-card balanced recommended">
            <div className="recommended-badge">RECOMMENDED</div>
            <h3>Balanced Choice</h3>
            <p className="tier-description">Optimal balance of cost & performance</p>
            <div className="sku-list">
              <div className="sku-item fabric">
                <span className="sku-name">F64</span>
                <span className="sku-price">{formatCurrency(result.fabric.monthlyPrice)}/mo</span>
              </div>
              <div className="sku-item synapse">
                <span className="sku-name">DWU1000c</span>
                <span className="sku-price">{formatCurrency(result.synapse.monthlyPrice)}/mo</span>
              </div>
              <div className="sku-item databricks">
                <span className="sku-name">Medium (24 DBU)</span>
                <span className="sku-price">{formatCurrency(result.databricks.monthlyPrice)}/mo</span>
              </div>
            </div>
            <ul className="benefits-list">
              <li className="success">✓ Handles 50+ Dashboards via bursting</li>
              <li className="success">✓ 2TB Data fits comfortably in memory</li>
              <li className="success">✓ Databricks: Scales to 2-3 clusters</li>
            </ul>
            <button className="btn btn-primary">Show Details</button>
          </div>

          {/* High Performance */}
          <div className="recommendation-card performance">
            <h3>High Performance</h3>
            <p className="tier-description">Maximum speed & headroom</p>
            <div className="sku-list">
              <div className="sku-item fabric">
                <span className="sku-name">F128</span>
                <span className="sku-price">{formatCurrency(result.fabric.monthlyPrice * 2)}/mo</span>
              </div>
              <div className="sku-item synapse">
                <span className="sku-name">DWU1500c</span>
                <span className="sku-price">{formatCurrency(result.synapse.monthlyPrice * 1.5)}/mo</span>
              </div>
              <div className="sku-item databricks">
                <span className="sku-name">Large (40 DBU)</span>
                <span className="sku-price">{formatCurrency(result.databricks.monthlyPrice * 1.67)}/mo</span>
              </div>
            </div>
            <ul className="benefits-list">
              <li className="success">✓ Zero latency for concurrent users</li>
              <li className="success">✓ Future-proof for data growth</li>
              <li className="success">✓ Databricks: Higher concurrency/node</li>
            </ul>
            <button className="btn btn-outline">Show Details</button>
          </div>
        </div>
      </section>

      <section className="cost-breakdown-section">
        <h2>Cost Breakdown</h2>
        <div className="cost-breakdown">
          <div className="breakdown-chart">
            {result.costBreakdown.components.map((comp, idx) => (
              <div key={idx} className="cost-component">
                <div className="component-label">{comp.label}</div>
                <div className="component-bar">
                  <div
                    className="component-fill"
                    style={{
                      width: `${comp.percentage}%`,
                      backgroundColor: ['#00d4aa', '#0078d4', '#ff6b35', '#ffc107', '#9c27b0'][idx % 5],
                    }}
                  />
                </div>
                <div className="component-value">{formatCurrency(comp.value)}</div>
              </div>
            ))}
          </div>
          <div className="breakdown-summary">
            <div className="summary-item">
              <span>Monthly Total</span>
              <span className="summary-value">{formatCurrency(result.costBreakdown.monthlyTotal)}</span>
            </div>
            <div className="summary-item">
              <span>Yearly Total</span>
              <span className="summary-value">{formatCurrency(result.costBreakdown.yearlyTotal)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="performance-metrics-section">
        <h2>Performance Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <h4>Query Latency</h4>
            <div className="metric-values">
              <div className="metric-value">
                <span className="label">p50</span>
                <span className="value">{result.performanceMetrics.queryLatency.p50}ms</span>
              </div>
              <div className="metric-value">
                <span className="label">p95</span>
                <span className="value">{result.performanceMetrics.queryLatency.p95}ms</span>
              </div>
              <div className="metric-value">
                <span className="label">p99</span>
                <span className="value">{result.performanceMetrics.queryLatency.p99}ms</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h4>Throughput</h4>
            <div className="metric-value large">
              <span className="value">{result.performanceMetrics.throughput}</span>
              <span className="label">Queries/sec</span>
            </div>
          </div>

          <div className="metric-card">
            <h4>Concurrency</h4>
            <div className="metric-value large">
              <span className="value">{result.performanceMetrics.concurrency}</span>
              <span className="label">Max Concurrent</span>
            </div>
          </div>

          <div className="metric-card">
            <h4>Scalability</h4>
            <div className="metric-value large">
              <span className="value">{result.performanceMetrics.scalability.toUpperCase()}</span>
              {result.performanceMetrics.burstCapability && (
                <span className="label">{result.performanceMetrics.burstCapability}x Burst</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
