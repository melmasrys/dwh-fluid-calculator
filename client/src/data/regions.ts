import { Region } from '@/types';

export const REGIONS: Region[] = [
  {
    id: 'us-east',
    name: 'US East (Virginia)',
    code: 'eastus',
    pricingMultiplier: 1.0,
    currency: 'USD',
    symbol: '$',
  },
  {
    id: 'us-west',
    name: 'US West (California)',
    code: 'westus',
    pricingMultiplier: 1.05,
    currency: 'USD',
    symbol: '$',
  },
  {
    id: 'eu-west',
    name: 'EU West (Ireland)',
    code: 'westeurope',
    pricingMultiplier: 1.15,
    currency: 'EUR',
    symbol: '€',
  },
  {
    id: 'eu-central',
    name: 'EU Central (Germany)',
    code: 'germanycentral',
    pricingMultiplier: 1.2,
    currency: 'EUR',
    symbol: '€',
  },
  {
    id: 'ap-southeast',
    name: 'Asia Pacific (Singapore)',
    code: 'southeastasia',
    pricingMultiplier: 1.25,
    currency: 'SGD',
    symbol: 'S$',
  },
  {
    id: 'ap-northeast',
    name: 'Asia Pacific (Japan)',
    code: 'japaneast',
    pricingMultiplier: 1.3,
    currency: 'JPY',
    symbol: '¥',
  },
  {
    id: 'ca-central',
    name: 'Canada (Central)',
    code: 'canadacentral',
    pricingMultiplier: 1.08,
    currency: 'CAD',
    symbol: 'C$',
  },
  {
    id: 'au-east',
    name: 'Australia (East)',
    code: 'australiaeast',
    pricingMultiplier: 1.35,
    currency: 'AUD',
    symbol: 'A$',
  },
];

export const getRegion = (id: string): Region | undefined => {
  return REGIONS.find(r => r.id === id);
};

export const getDefaultRegion = (): Region => {
  return REGIONS[0]; // US East by default
};
