import { WorkloadProfile } from '@/types';

export const WORKLOAD_PROFILES: WorkloadProfile[] = [
  {
    id: 'olap',
    name: 'OLAP (Analytical)',
    description: 'Online Analytical Processing - Complex queries, large scans, batch operations',
    category: 'OLAP',
    cpuIntensity: 0.8,
    memoryIntensity: 0.9,
    ioIntensity: 0.7,
  },
  {
    id: 'oltp',
    name: 'OLTP (Transactional)',
    description: 'Online Transaction Processing - Short queries, frequent updates, high concurrency',
    category: 'OLTP',
    cpuIntensity: 0.6,
    memoryIntensity: 0.5,
    ioIntensity: 0.8,
  },
  {
    id: 'realtime',
    name: 'Real-time Analytics',
    description: 'Streaming data ingestion with immediate query availability',
    category: 'RealTime',
    cpuIntensity: 0.9,
    memoryIntensity: 0.8,
    ioIntensity: 0.9,
  },
  {
    id: 'datalake',
    name: 'Data Lake',
    description: 'Large-scale data storage with exploratory queries and ML workloads',
    category: 'DataLake',
    cpuIntensity: 0.7,
    memoryIntensity: 0.6,
    ioIntensity: 0.6,
  },
];

export const getWorkloadProfile = (id: string): WorkloadProfile | undefined => {
  return WORKLOAD_PROFILES.find(w => w.id === id);
};

export const getDefaultWorkloadProfile = (): WorkloadProfile => {
  return WORKLOAD_PROFILES[0]; // OLAP by default
};
