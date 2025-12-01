// Core Types for DWH Sizing Calculator v3

export type Platform = 'fabric' | 'synapse' | 'databricks';
export type QueryComplexity = 'simple' | 'complex';
export type IngestionType = 'batch' | 'streaming';
export type WorkloadCategory = 'OLAP' | 'OLTP' | 'RealTime' | 'DataLake';
export type PricingModel = 'on-demand' | 'reserved' | 'spot' | 'hybrid';
export type RecommendationTier = 'minimum' | 'balanced' | 'performance';

export interface SizingConfig {
  dataVolumeGB: number;
  concurrentUsers: number;
  workloadProfile: WorkloadProfile;
  region: Region;
  pricingModel: PricingModel;
  reservedPercentage?: number;
  queryComplexity: QueryComplexity;
  ingestionType: IngestionType;
}

export interface WorkloadProfile {
  id: string;
  name: string;
  description: string;
  category: WorkloadCategory;
  cpuIntensity: number;
  memoryIntensity: number;
  ioIntensity: number;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  pricingMultiplier: number;
  currency: string;
  symbol: string;
}

export interface SKU {
  id: string;
  platform: Platform;
  name: string;
  basePrice: number;
  specs: TechnicalSpecs;
}

export interface TechnicalSpecs {
  computeUnits?: number;
  vCores?: number;
  memory: string;
  storage: string;
  concurrency: number;
  scalingType: 'manual' | 'auto' | 'burst';
}

export interface SizingResult {
  tier: RecommendationTier;
  fabric: PlatformRecommendation;
  synapse: PlatformRecommendation;
  databricks: PlatformRecommendation;
  costBreakdown: CostBreakdown;
  performanceMetrics: PerformanceMetrics;
  warnings: string[];
  benefits: string[];
}

export interface PlatformRecommendation {
  sku: string;
  cost: number;
  specs: TechnicalSpecs;
  monthlyPrice: number;
  yearlyPrice: number;
  reservedPrice?: number;
  spotPrice?: number;
}

export interface CostBreakdown {
  compute: number;
  storage: number;
  licensing: number;
  ingestion: number;
  egress: number;
  total: number;
  components: CostComponent[];
  monthlyTotal: number;
  yearlyTotal: number;
  reservedDiscount?: number;
  spotSavings?: number;
}

export interface CostComponent {
  label: string;
  value: number;
  percentage: number;
  category: 'compute' | 'storage' | 'licensing' | 'ingestion' | 'egress';
}

export interface PerformanceMetrics {
  queryLatency: {
    p50: number;
    p95: number;
    p99: number;
  };
  throughput: number;
  concurrency: number;
  scalability: 'manual' | 'auto' | 'burst';
  burstCapability?: number;
}

export interface SavedConfiguration {
  id: string;
  name: string;
  description: string;
  config: SizingConfig;
  result: SizingResult;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface HistoryEntry {
  id: string;
  config: SizingConfig;
  result: SizingResult;
  timestamp: Date;
}

export interface ComparisonData {
  scenarios: ComparisonScenario[];
  selectedScenario: string;
}

export interface ComparisonScenario {
  id: string;
  name: string;
  description: string;
  dataVolumeGB: number;
  concurrentUsers: number;
  workloadProfile: WorkloadProfile;
}

export interface SpecificationRow {
  feature: string;
  fabric: string;
  synapse: string;
  databricks: string;
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  includeCharts: boolean;
  includeHistory: boolean;
  includeComparison: boolean;
}
