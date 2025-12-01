import { SizingConfig, SizingResult, PlatformRecommendation, CostBreakdown, PerformanceMetrics, RecommendationTier } from '@/types';
import { getSKU, getSKUsByPlatform } from '@/data/skus';
import { getRegion } from '@/data/regions';

export const calculateSizing = (config: SizingConfig): SizingResult => {
  const region = getRegion(config.region.id) || config.region;
  
  // Determine recommendation tier based on data volume and concurrency
  const tier = determineTier(config.dataVolumeGB, config.concurrentUsers);
  
  // Get SKU recommendations for each platform
  const fabricSKU = getSKUsByPlatform('fabric')[tier === 'minimum' ? 2 : tier === 'balanced' ? 4 : 6];
  const synapseSKU = getSKUsByPlatform('synapse')[tier === 'minimum' ? 2 : tier === 'balanced' ? 4 : 5];
  const databricksSKU = getSKUsByPlatform('databricks')[tier === 'minimum' ? 0 : tier === 'balanced' ? 1 : 2];

  const fabricRec = calculatePlatformRecommendation(fabricSKU, config, region);
  const synapseRec = calculatePlatformRecommendation(synapseSKU, config, region);
  const databricksRec = calculatePlatformRecommendation(databricksSKU, config, region);

  const costBreakdown = calculateCostBreakdown(config, fabricRec, synapseRec, databricksRec);
  const performanceMetrics = calculatePerformanceMetrics(config, tier);

  return {
    tier,
    fabric: fabricRec,
    synapse: synapseRec,
    databricks: databricksRec,
    costBreakdown,
    performanceMetrics,
    warnings: generateWarnings(config, tier),
    benefits: generateBenefits(config, tier),
  };
};

const determineTier = (dataVolumeGB: number, concurrentUsers: number): RecommendationTier => {
  const score = (dataVolumeGB / 1024) * 0.6 + concurrentUsers * 0.4;
  
  if (score < 50) return 'minimum';
  if (score < 200) return 'balanced';
  return 'performance';
};

const calculatePlatformRecommendation = (sku: any, config: SizingConfig, region: any): PlatformRecommendation => {
  const baseCost = sku.basePrice * region.pricingMultiplier;
  const monthlyPrice = baseCost;
  const yearlyPrice = baseCost * 12;
  
  // Apply pricing model adjustments
  let finalPrice = monthlyPrice;
  let reservedPrice = undefined;
  let spotPrice = undefined;

  if (config.pricingModel === 'reserved' || config.pricingModel === 'hybrid') {
    reservedPrice = monthlyPrice * 0.7; // 30% discount
  }
  
  if (config.pricingModel === 'spot' || config.pricingModel === 'hybrid') {
    spotPrice = monthlyPrice * 0.5; // 50% discount
  }

  if (config.pricingModel === 'hybrid' && config.reservedPercentage) {
    const reserved = (monthlyPrice * 0.7) * (config.reservedPercentage / 100);
    const onDemand = monthlyPrice * ((100 - config.reservedPercentage) / 100);
    finalPrice = reserved + onDemand;
  } else if (config.pricingModel === 'reserved') {
    finalPrice = reservedPrice || monthlyPrice;
  } else if (config.pricingModel === 'spot') {
    finalPrice = spotPrice || monthlyPrice;
  }

  return {
    sku: sku.name,
    cost: finalPrice,
    specs: sku.specs,
    monthlyPrice: finalPrice,
    yearlyPrice: finalPrice * 12,
    reservedPrice,
    spotPrice,
  };
};

const calculateCostBreakdown = (config: SizingConfig, fabric: PlatformRecommendation, synapse: PlatformRecommendation, databricks: PlatformRecommendation): CostBreakdown => {
  const avgCost = (fabric.monthlyPrice + synapse.monthlyPrice + databricks.monthlyPrice) / 3;
  
  // Estimate cost components
  const compute = avgCost * 0.5;
  const storage = (config.dataVolumeGB / 1024) * 0.023 * 12; // ~$0.023/GB/month
  const licensing = avgCost * 0.15;
  const ingestion = config.ingestionType === 'streaming' ? avgCost * 0.1 : 0;
  const egress = avgCost * 0.05;
  const total = compute + storage + licensing + ingestion + egress;

  const components = [
    { label: 'Compute', value: compute, percentage: (compute / total) * 100, category: 'compute' as const },
    { label: 'Storage', value: storage, percentage: (storage / total) * 100, category: 'storage' as const },
    { label: 'Licensing', value: licensing, percentage: (licensing / total) * 100, category: 'licensing' as const },
    { label: 'Ingestion', value: ingestion, percentage: (ingestion / total) * 100, category: 'ingestion' as const },
    { label: 'Egress', value: egress, percentage: (egress / total) * 100, category: 'egress' as const },
  ];

  return {
    compute,
    storage,
    licensing,
    ingestion,
    egress,
    total,
    components,
    monthlyTotal: total,
    yearlyTotal: total * 12,
  };
};

const calculatePerformanceMetrics = (config: SizingConfig, tier: RecommendationTier): PerformanceMetrics => {
  const baseLatency = tier === 'minimum' ? 300 : tier === 'balanced' ? 150 : 50;
  const baseThroughput = tier === 'minimum' ? 100 : tier === 'balanced' ? 500 : 1000;
  const baseConcurrency = config.concurrentUsers;

  // Adjust based on workload intensity
  const cpuFactor = config.workloadProfile.cpuIntensity;
  const latencyMultiplier = 1 + (cpuFactor * 0.5);

  return {
    queryLatency: {
      p50: Math.round(baseLatency * latencyMultiplier),
      p95: Math.round(baseLatency * latencyMultiplier * 1.5),
      p99: Math.round(baseLatency * latencyMultiplier * 2),
    },
    throughput: Math.round(baseThroughput / latencyMultiplier),
    concurrency: baseConcurrency,
    scalability: tier === 'minimum' ? 'manual' : tier === 'balanced' ? 'auto' : 'burst',
    burstCapability: tier === 'performance' ? 3 : undefined,
  };
};

const generateWarnings = (config: SizingConfig, tier: RecommendationTier): string[] => {
  const warnings: string[] = [];

  if (tier === 'minimum' && config.concurrentUsers > 30) {
    warnings.push('May struggle with high concurrent user load');
  }

  if (config.ingestionType === 'streaming' && tier === 'minimum') {
    warnings.push('Streaming workload may cause latency issues');
  }

  if (config.dataVolumeGB > 100000 && tier === 'minimum') {
    warnings.push('Data volume exceeds recommended capacity');
  }

  if (config.queryComplexity === 'complex' && tier === 'minimum') {
    warnings.push('Complex queries may timeout');
  }

  return warnings;
};

const generateBenefits = (config: SizingConfig, tier: RecommendationTier): string[] => {
  const benefits: string[] = [];

  if (tier === 'balanced') {
    benefits.push('Optimal balance of cost and performance');
    benefits.push('Handles concurrent workloads efficiently');
  }

  if (tier === 'performance') {
    benefits.push('Zero latency for concurrent users');
    benefits.push('Future-proof for data growth');
    benefits.push('Maximum throughput and scalability');
  }

  if (config.pricingModel === 'reserved') {
    benefits.push('30% savings with reserved capacity');
  }

  if (config.pricingModel === 'hybrid') {
    benefits.push('Optimized cost with mixed pricing');
  }

  return benefits;
};
