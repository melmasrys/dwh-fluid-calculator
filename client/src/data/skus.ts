import { SKU } from '@/types';

export const SKUS: SKU[] = [
  // Microsoft Fabric SKUs
  {
    id: 'fabric-f2',
    platform: 'fabric',
    name: 'F2',
    basePrice: 131.4,
    specs: {
      computeUnits: 2,
      vCores: 4,
      memory: '16 GB',
      storage: '1 TB',
      concurrency: 10,
      scalingType: 'burst',
    },
  },
  {
    id: 'fabric-f4',
    platform: 'fabric',
    name: 'F4',
    basePrice: 262.8,
    specs: {
      computeUnits: 4,
      vCores: 8,
      memory: '32 GB',
      storage: '2 TB',
      concurrency: 20,
      scalingType: 'burst',
    },
  },
  {
    id: 'fabric-f8',
    platform: 'fabric',
    name: 'F8',
    basePrice: 525.6,
    specs: {
      computeUnits: 8,
      vCores: 16,
      memory: '64 GB',
      storage: '4 TB',
      concurrency: 40,
      scalingType: 'burst',
    },
  },
  {
    id: 'fabric-f16',
    platform: 'fabric',
    name: 'F16',
    basePrice: 1051.2,
    specs: {
      computeUnits: 16,
      vCores: 32,
      memory: '128 GB',
      storage: '8 TB',
      concurrency: 80,
      scalingType: 'burst',
    },
  },
  {
    id: 'fabric-f32',
    platform: 'fabric',
    name: 'F32',
    basePrice: 2102.4,
    specs: {
      computeUnits: 32,
      vCores: 64,
      memory: '256 GB',
      storage: '16 TB',
      concurrency: 160,
      scalingType: 'burst',
    },
  },
  {
    id: 'fabric-f64',
    platform: 'fabric',
    name: 'F64',
    basePrice: 4204.8,
    specs: {
      computeUnits: 64,
      vCores: 128,
      memory: '512 GB',
      storage: '32 TB',
      concurrency: 320,
      scalingType: 'burst',
    },
  },
  {
    id: 'fabric-f128',
    platform: 'fabric',
    name: 'F128',
    basePrice: 8409.6,
    specs: {
      computeUnits: 128,
      vCores: 256,
      memory: '1024 GB',
      storage: '64 TB',
      concurrency: 640,
      scalingType: 'burst',
    },
  },

  // Azure Synapse Analytics SKUs
  {
    id: 'synapse-dw100c',
    platform: 'synapse',
    name: 'DW100c',
    basePrice: 151.2,
    specs: {
      vCores: 8,
      memory: '60 GB',
      storage: '1 TB',
      concurrency: 32,
      scalingType: 'manual',
    },
  },
  {
    id: 'synapse-dw500c',
    platform: 'synapse',
    name: 'DW500c',
    basePrice: 756,
    specs: {
      vCores: 40,
      memory: '300 GB',
      storage: '5 TB',
      concurrency: 128,
      scalingType: 'manual',
    },
  },
  {
    id: 'synapse-dw1000c',
    platform: 'synapse',
    name: 'DW1000c',
    basePrice: 1512,
    specs: {
      vCores: 80,
      memory: '600 GB',
      storage: '10 TB',
      concurrency: 256,
      scalingType: 'manual',
    },
  },
  {
    id: 'synapse-dw1500c',
    platform: 'synapse',
    name: 'DW1500c',
    basePrice: 2268,
    specs: {
      vCores: 120,
      memory: '900 GB',
      storage: '15 TB',
      concurrency: 384,
      scalingType: 'manual',
    },
  },
  {
    id: 'synapse-dw2000c',
    platform: 'synapse',
    name: 'DW2000c',
    basePrice: 3024,
    specs: {
      vCores: 160,
      memory: '1200 GB',
      storage: '20 TB',
      concurrency: 512,
      scalingType: 'manual',
    },
  },
  {
    id: 'synapse-dw3000c',
    platform: 'synapse',
    name: 'DW3000c',
    basePrice: 4536,
    specs: {
      vCores: 240,
      memory: '1800 GB',
      storage: '30 TB',
      concurrency: 768,
      scalingType: 'manual',
    },
  },

  // Azure Databricks SKUs
  {
    id: 'databricks-small',
    platform: 'databricks',
    name: 'Small (12 DBU)',
    basePrice: 600,
    specs: {
      vCores: 16,
      memory: '64 GB',
      storage: '2 TB',
      concurrency: 10,
      scalingType: 'auto',
    },
  },
  {
    id: 'databricks-medium',
    platform: 'databricks',
    name: 'Medium (24 DBU)',
    basePrice: 1200,
    specs: {
      vCores: 32,
      memory: '128 GB',
      storage: '4 TB',
      concurrency: 20,
      scalingType: 'auto',
    },
  },
  {
    id: 'databricks-large',
    platform: 'databricks',
    name: 'Large (40 DBU)',
    basePrice: 2000,
    specs: {
      vCores: 64,
      memory: '256 GB',
      storage: '8 TB',
      concurrency: 40,
      scalingType: 'auto',
    },
  },
  {
    id: 'databricks-xlarge',
    platform: 'databricks',
    name: 'X-Large (64 DBU)',
    basePrice: 3200,
    specs: {
      vCores: 128,
      memory: '512 GB',
      storage: '16 TB',
      concurrency: 80,
      scalingType: 'auto',
    },
  },
];

export const getSKU = (id: string): SKU | undefined => {
  return SKUS.find(sku => sku.id === id);
};

export const getSKUsByPlatform = (platform: string): SKU[] => {
  return SKUS.filter(sku => sku.platform === platform);
};
