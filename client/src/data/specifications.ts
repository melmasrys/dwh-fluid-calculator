import { SpecificationRow } from '@/types';

export const TECHNICAL_SPECIFICATIONS: SpecificationRow[] = [
  {
    feature: 'Primary Unit',
    fabric: '64 Capacity Units (CU)',
    synapse: '1000 DWU',
    databricks: '24 DBUs (Medium)',
  },
  {
    feature: 'Compute Cores',
    fabric: '128 (Base) - 384 (Burst) vCores',
    synapse: '80 vCores',
    databricks: 'Abstracted (Autoscaling)',
  },
  {
    feature: 'Memory',
    fabric: 'Unified Pool',
    synapse: '600 GB Total',
    databricks: 'Abstracted',
  },
  {
    feature: 'Concurrency',
    fabric: 'Dynamic (Bursting)',
    synapse: '256 Slots (Static)',
    databricks: '20 Queries/Cluster (Scaling)',
  },
  {
    feature: 'Scaling Logic',
    fabric: 'Bursting (3x)',
    synapse: 'Manual Scaling',
    databricks: 'Multi-Cluster Autoscaling',
  },
  {
    feature: 'Storage Capacity',
    fabric: '32 TB',
    synapse: '10 TB',
    databricks: '4 TB',
  },
  {
    feature: 'Query Latency (p50)',
    fabric: '< 100ms',
    synapse: '< 200ms',
    databricks: '< 150ms',
  },
  {
    feature: 'Throughput',
    fabric: '1000+ QPS',
    synapse: '500+ QPS',
    databricks: '750+ QPS',
  },
  {
    feature: 'Pricing Model',
    fabric: 'Capacity-based',
    synapse: 'DWU-based',
    databricks: 'DBU-based',
  },
  {
    feature: 'Reserved Instance Discount',
    fabric: 'Up to 30%',
    synapse: 'Up to 35%',
    databricks: 'Up to 40%',
  },
];

export const COMPARISON_SCENARIOS = [
  {
    id: 'scenario-1',
    name: '2TB Database + 50 Dashboards',
    description: 'Mid-sized enterprise workload with high concurrency requirements',
    dataVolumeGB: 2048,
    concurrentUsers: 50,
  },
  {
    id: 'scenario-2',
    name: '500GB + 10 Users',
    description: 'Small departmental analytics workload',
    dataVolumeGB: 500,
    concurrentUsers: 10,
  },
  {
    id: 'scenario-3',
    name: '50TB + 200 Users',
    description: 'Large enterprise data warehouse',
    dataVolumeGB: 51200,
    concurrentUsers: 200,
  },
  {
    id: 'scenario-4',
    name: '10TB + 100 Users',
    description: 'Medium enterprise analytics platform',
    dataVolumeGB: 10240,
    concurrentUsers: 100,
  },
];
