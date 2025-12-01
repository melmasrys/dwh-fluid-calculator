import { SizingConfig, SizingResult, ExportOptions } from '@/types';

export const exportToCSV = (config: SizingConfig, result: SizingResult): string => {
  const rows: string[] = [];

  // Header
  rows.push('DWH Sizing Calculator Report');
  rows.push('');

  // Configuration
  rows.push('CONFIGURATION');
  rows.push(`Data Volume (GB),${config.dataVolumeGB}`);
  rows.push(`Data Volume (TB),${(config.dataVolumeGB / 1024).toFixed(2)}`);
  rows.push(`Concurrent Users,${config.concurrentUsers}`);
  rows.push(`Workload Profile,${config.workloadProfile.name}`);
  rows.push(`Region,${config.region.name}`);
  rows.push(`Pricing Model,${config.pricingModel}`);
  rows.push(`Query Complexity,${config.queryComplexity}`);
  rows.push(`Ingestion Type,${config.ingestionType}`);
  rows.push('');

  // Recommendations
  rows.push('RECOMMENDATIONS');
  rows.push(`Recommendation Tier,${result.tier.toUpperCase()}`);
  rows.push('');

  // Platform SKUs
  rows.push('PLATFORM RECOMMENDATIONS');
  rows.push('Platform,SKU,Monthly Cost,Yearly Cost');
  rows.push(`Microsoft Fabric,${result.fabric.sku},$${result.fabric.monthlyPrice.toFixed(2)},$${result.fabric.yearlyPrice.toFixed(2)}`);
  rows.push(`Azure Synapse,${result.synapse.sku},$${result.synapse.monthlyPrice.toFixed(2)},$${result.synapse.yearlyPrice.toFixed(2)}`);
  rows.push(`Azure Databricks,${result.databricks.sku},$${result.databricks.monthlyPrice.toFixed(2)},$${result.databricks.yearlyPrice.toFixed(2)}`);
  rows.push('');

  // Cost Breakdown
  rows.push('COST BREAKDOWN');
  rows.push('Component,Amount,Percentage');
  result.costBreakdown.components.forEach(comp => {
    rows.push(`${comp.label},$${comp.value.toFixed(2)},${comp.percentage.toFixed(1)}%`);
  });
  rows.push(`Total Monthly,$${result.costBreakdown.monthlyTotal.toFixed(2)},100%`);
  rows.push(`Total Yearly,$${result.costBreakdown.yearlyTotal.toFixed(2)},100%`);
  rows.push('');

  // Performance Metrics
  rows.push('PERFORMANCE METRICS');
  rows.push(`Query Latency P50,${result.performanceMetrics.queryLatency.p50}ms`);
  rows.push(`Query Latency P95,${result.performanceMetrics.queryLatency.p95}ms`);
  rows.push(`Query Latency P99,${result.performanceMetrics.queryLatency.p99}ms`);
  rows.push(`Throughput,${result.performanceMetrics.throughput} QPS`);
  rows.push(`Concurrency,${result.performanceMetrics.concurrency} concurrent users`);
  rows.push(`Scalability,${result.performanceMetrics.scalability}`);
  rows.push('');

  // Warnings
  if (result.warnings.length > 0) {
    rows.push('WARNINGS');
    result.warnings.forEach(w => rows.push(w));
    rows.push('');
  }

  // Benefits
  if (result.benefits.length > 0) {
    rows.push('BENEFITS');
    result.benefits.forEach(b => rows.push(b));
    rows.push('');
  }

  // Footer
  rows.push('');
  rows.push(`Generated: ${new Date().toISOString()}`);
  rows.push('Source: DWH Sizing Calculator v3.0');

  return rows.join('\n');
};

export const exportToJSON = (config: SizingConfig, result: SizingResult): string => {
  const data = {
    metadata: {
      version: '3.0',
      generatedAt: new Date().toISOString(),
      title: 'DWH Sizing Calculator Report',
    },
    configuration: {
      dataVolumeGB: config.dataVolumeGB,
      dataVolumeTB: config.dataVolumeGB / 1024,
      concurrentUsers: config.concurrentUsers,
      workloadProfile: config.workloadProfile,
      region: config.region,
      pricingModel: config.pricingModel,
      queryComplexity: config.queryComplexity,
      ingestionType: config.ingestionType,
    },
    recommendations: {
      tier: result.tier,
      fabric: result.fabric,
      synapse: result.synapse,
      databricks: result.databricks,
    },
    costBreakdown: result.costBreakdown,
    performanceMetrics: result.performanceMetrics,
    warnings: result.warnings,
    benefits: result.benefits,
  };

  return JSON.stringify(data, null, 2);
};

export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateShareableURL = (config: SizingConfig): string => {
  const params = new URLSearchParams();
  params.set('dv', config.dataVolumeGB.toString());
  params.set('cu', config.concurrentUsers.toString());
  params.set('wp', config.workloadProfile.id);
  params.set('rg', config.region.id);
  params.set('pm', config.pricingModel);
  params.set('qc', config.queryComplexity);
  params.set('it', config.ingestionType);
  
  return `${window.location.origin}?${params.toString()}`;
};

export const parseShareableURL = (searchParams: URLSearchParams): Partial<SizingConfig> => {
  return {
    dataVolumeGB: parseInt(searchParams.get('dv') || '1024'),
    concurrentUsers: parseInt(searchParams.get('cu') || '20'),
    queryComplexity: (searchParams.get('qc') || 'complex') as any,
    ingestionType: (searchParams.get('it') || 'batch') as any,
    pricingModel: (searchParams.get('pm') || 'on-demand') as any,
  };
};
