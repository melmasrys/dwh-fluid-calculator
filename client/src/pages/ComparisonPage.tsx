import { useLocation } from 'wouter';
import { useCalculator } from '@/contexts/CalculatorContext';
import { TECHNICAL_SPECIFICATIONS } from '@/data/specifications';
import { ArrowRight, BarChart3, Zap } from 'lucide-react';
import '../styles/comparison.css';

// Helper functions from Calculator
const calculateFabric = (tb: number, users: number, complexity: string, ingestion: string, tier: string) => {
  let score = (tb * 2) + (users * 0.5);
  if (complexity === "complex") score *= 1.5;
  if (ingestion === "streaming") score *= 1.2;
  if (tier === "Minimum") score *= 0.6;
  else if (tier === "Performance") score *= 1.5;
  
  const FABRIC_SKUS = [
    { name: "F2", cores: 2, cost: 262.8 },
    { name: "F4", cores: 4, cost: 525.6 },
    { name: "F8", cores: 8, cost: 1051.2 },
    { name: "F16", cores: 16, cost: 2102.4 },
    { name: "F32", cores: 32, cost: 4204.8 },
    { name: "F64", cores: 64, cost: 8409.6 },
    { name: "F128", cores: 128, cost: 16819.2 },
    { name: "F256", cores: 256, cost: 33638.4 },
    { name: "F512", cores: 512, cost: 67276.8 },
  ];
  
  let skuIndex = 0;
  if (score < 10) skuIndex = 1;
  else if (score < 30) skuIndex = 2;
  else if (score < 60) skuIndex = 3;
  else if (score < 120) skuIndex = 4;
  else if (score < 250) skuIndex = 5;
  else if (score < 500) skuIndex = 6;
  else skuIndex = 7;

  const sku = FABRIC_SKUS[skuIndex];
  return { sku: sku.name, cores: sku.cores, memory: `${sku.cores * 8} GB`, cost: sku.cost };
};

const calculateSynapse = (tb: number, users: number, complexity: string, ingestion: string, tier: string) => {
  let requiredSlots = users * (complexity === "complex" ? 5 : 3);
  let requiredDwu = Math.max(tb * 100, requiredSlots * 15);
  if (ingestion === "streaming") requiredDwu *= 1.3;
  if (tier === "Minimum") requiredDwu *= 0.6;
  else if (tier === "Performance") requiredDwu *= 1.5;
  
  const SYNAPSE_SKUS = [
    { name: "DW100c", dwu: 100, cost: 151.0 },
    { name: "DW200c", dwu: 200, cost: 302.0 },
    { name: "DW300c", dwu: 300, cost: 453.0 },
    { name: "DW400c", dwu: 400, cost: 604.0 },
    { name: "DW500c", dwu: 500, cost: 755.0 },
    { name: "DW1000c", dwu: 1000, cost: 1510.0 },
    { name: "DW1500c", dwu: 1500, cost: 2265.0 },
    { name: "DW2000c", dwu: 2000, cost: 3020.0 },
    { name: "DW2500c", dwu: 2500, cost: 3775.0 },
    { name: "DW3000c", dwu: 3000, cost: 4530.0 },
    { name: "DW5000c", dwu: 5000, cost: 7550.0 },
    { name: "DW6000c", dwu: 6000, cost: 9060.0 },
    { name: "DW7500c", dwu: 7500, cost: 11325.0 },
    { name: "DW10000c", dwu: 10000, cost: 15100.0 },
    { name: "DW15000c", dwu: 15000, cost: 22650.0 },
    { name: "DW30000c", dwu: 30000, cost: 45300.0 },
  ];
  
  let sku = SYNAPSE_SKUS.find(s => s.dwu >= requiredDwu) || SYNAPSE_SKUS[SYNAPSE_SKUS.length - 1];
  return { sku: sku.name, cores: Math.round(sku.dwu / 15), memory: `${Math.round(sku.dwu * 0.6)} GB`, cost: sku.cost };
};

const calculateDatabricks = (tb: number, users: number, complexity: string, ingestion: string, tier: string) => {
  let score = (tb * 1.5) + (users * 0.8);
  if (complexity === "complex") score *= 1.4;
  if (ingestion === "streaming") score *= 1.1;
  if (tier === "Minimum") score *= 0.6;
  else if (tier === "Performance") score *= 1.5;
  
  const DATABRICKS_CLUSTERS = [
    { name: "2X-Small", dbus: 4, cost: 250 },
    { name: "X-Small", dbus: 8, cost: 500 },
    { name: "Small", dbus: 16, cost: 1000 },
    { name: "Medium", dbus: 32, cost: 2000 },
    { name: "Large", dbus: 64, cost: 4000 },
    { name: "X-Large", dbus: 128, cost: 8000 },
    { name: "2X-Large", dbus: 256, cost: 16000 },
    { name: "3X-Large", dbus: 384, cost: 24000 },
    { name: "4X-Large", dbus: 512, cost: 32000 },
  ];
  
  let skuIndex = 0;
  if (score < 20) skuIndex = 1;
  else if (score < 50) skuIndex = 2;
  else if (score < 100) skuIndex = 3;
  else if (score < 200) skuIndex = 4;
  else if (score < 400) skuIndex = 5;
  else skuIndex = 6;

  const sku = DATABRICKS_CLUSTERS[skuIndex];
  return { sku: sku.name, cores: sku.dbus * 2, memory: `${sku.dbus * 8} GB`, cost: sku.cost };
};

export default function ComparisonPage() {
  const [, setLocation] = useLocation();
  const { state } = useCalculator();

  const tbValue = state.dataVolumeGB / 1024;
  const fabricResult = calculateFabric(tbValue, state.concurrency, state.queryComplexity, state.ingestionType, state.selectedTier);
  const synapseResult = calculateSynapse(tbValue, state.concurrency, state.queryComplexity, state.ingestionType, state.selectedTier);
  const databricksResult = calculateDatabricks(tbValue, state.concurrency, state.queryComplexity, state.ingestionType, state.selectedTier);

  const formatDataVolume = (gb: number): string => {
    if (gb >= 1024) {
      return `${(gb / 1024).toFixed(2)} TB`;
    }
    return `${gb} GB`;
  };

  return (
    <div className="comparison-page">
      {/* Configuration Summary */}
      <section className="config-summary" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '2rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Your Configuration</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(0,212,170,0.1)', borderRadius: '0.5rem', border: '1px solid rgba(0,212,170,0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>Data Volume</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00d4aa' }}>{formatDataVolume(state.dataVolumeGB)}</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(0,212,170,0.1)', borderRadius: '0.5rem', border: '1px solid rgba(0,212,170,0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>Concurrent Users</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00d4aa' }}>{state.concurrency}</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(0,212,170,0.1)', borderRadius: '0.5rem', border: '1px solid rgba(0,212,170,0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>Sizing Tier</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00d4aa' }}>{state.selectedTier}</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(0,212,170,0.1)', borderRadius: '0.5rem', border: '1px solid rgba(0,212,170,0.3)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>Query Complexity</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00d4aa', textTransform: 'capitalize' }}>{state.queryComplexity}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="verdict-section">
        <div className="verdict-content">
          <h2>Your Recommendations <span className="highlight">Based on Your Configuration</span></h2>
          <p className="verdict-text">
            Based on <strong>{formatDataVolume(state.dataVolumeGB)}</strong> of data and <strong>{state.concurrency} concurrent users</strong>, here are the optimized SKU recommendations for each platform.
          </p>

          <div className="platform-cards">
            <div className="platform-card fabric">
              <div className="card-icon">⚡</div>
              <h3>Microsoft Fabric</h3>
              <div className="card-spec">
                <span className="label">Recommended SKU</span>
                <span className="value" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00d4aa' }}>{fabricResult.sku}</span>
              </div>
              <div className="card-spec">
                <span className="label">Compute Cores</span>
                <span className="value">{fabricResult.cores} vCores</span>
              </div>
              <div className="card-spec">
                <span className="label">Memory</span>
                <span className="value">{fabricResult.memory}</span>
              </div>
              <div className="card-spec">
                <span className="label">Est. Monthly Cost</span>
                <span className="value" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>${fabricResult.cost.toLocaleString()}</span>
              </div>
            </div>

            <div className="platform-card synapse">
              <div className="card-icon">🔷</div>
              <h3>Azure Synapse</h3>
              <div className="card-spec">
                <span className="label">Recommended SKU</span>
                <span className="value" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00d4aa' }}>{synapseResult.sku}</span>
              </div>
              <div className="card-spec">
                <span className="label">Compute Cores</span>
                <span className="value">{synapseResult.cores} vCores</span>
              </div>
              <div className="card-spec">
                <span className="label">Memory</span>
                <span className="value">{synapseResult.memory}</span>
              </div>
              <div className="card-spec">
                <span className="label">Est. Monthly Cost</span>
                <span className="value" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>${synapseResult.cost.toLocaleString()}</span>
              </div>
            </div>

            <div className="platform-card databricks">
              <div className="card-icon">🔶</div>
              <h3>Azure Databricks</h3>
              <div className="card-spec">
                <span className="label">Recommended SKU</span>
                <span className="value" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00d4aa' }}>{databricksResult.sku}</span>
              </div>
              <div className="card-spec">
                <span className="label">Compute Cores</span>
                <span className="value">{databricksResult.cores} vCores</span>
              </div>
              <div className="card-spec">
                <span className="label">Memory</span>
                <span className="value">{databricksResult.memory}</span>
              </div>
              <div className="card-spec">
                <span className="label">Est. Monthly Cost</span>
                <span className="value" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>${databricksResult.cost.toLocaleString()}</span>
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
                  <th className="fabric-col">Microsoft Fabric ({fabricResult.sku})</th>
                  <th className="synapse-col">Azure Synapse ({synapseResult.sku})</th>
                  <th className="databricks-col">Azure Databricks ({databricksResult.sku})</th>
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
        <h2>Ready to Adjust Your Configuration?</h2>
        <p>Go back to the calculator to modify your parameters and see updated recommendations.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary btn-large"
            onClick={() => setLocation('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowRight size={18} /> Back to Calculator
          </button>
          <button 
            className="btn btn-outline btn-large"
            onClick={() => setLocation('/sizing')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <BarChart3 size={18} /> View Sizing Guide
          </button>
        </div>
      </section>
    </div>
  );
}
