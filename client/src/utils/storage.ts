import { SavedConfiguration, HistoryEntry, SizingConfig, SizingResult } from '@/types';

const STORAGE_KEY_SAVED = 'dwh_calc_saved_configs';
const STORAGE_KEY_HISTORY = 'dwh_calc_history';
const MAX_HISTORY_ITEMS = 50;

export const saveConfiguration = (name: string, description: string, config: SizingConfig, result: SizingResult): SavedConfiguration => {
  const saved: SavedConfiguration = {
    id: Date.now().toString(),
    name,
    description,
    config,
    result,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
  };

  const existing = getSavedConfigurations();
  existing.push(saved);
  localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(existing));

  return saved;
};

export const getSavedConfigurations = (): SavedConfiguration[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_SAVED);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const deleteSavedConfiguration = (id: string): void => {
  const existing = getSavedConfigurations();
  const filtered = existing.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(filtered));
};

export const updateSavedConfiguration = (id: string, updates: Partial<SavedConfiguration>): void => {
  const existing = getSavedConfigurations();
  const index = existing.findIndex(c => c.id === id);
  if (index !== -1) {
    existing[index] = { ...existing[index], ...updates, updatedAt: new Date() };
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(existing));
  }
};

export const addToHistory = (config: SizingConfig, result: SizingResult): HistoryEntry => {
  const entry: HistoryEntry = {
    id: Date.now().toString(),
    config,
    result,
    timestamp: new Date(),
  };

  const existing = getHistory();
  existing.unshift(entry);

  // Keep only last 50 entries
  if (existing.length > MAX_HISTORY_ITEMS) {
    existing.pop();
  }

  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(existing));
  return entry;
};

export const getHistory = (): HistoryEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY_HISTORY);
};

export const getHistoryStats = () => {
  const history = getHistory();
  if (history.length === 0) {
    return null;
  }

  const costs = history.map(h => h.result.costBreakdown.monthlyTotal);
  const avgCost = costs.reduce((a, b) => a + b, 0) / costs.length;
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);

  return {
    totalEntries: history.length,
    averageMonthlyCost: avgCost,
    minMonthlyCost: minCost,
    maxMonthlyCost: maxCost,
    costTrend: costs,
  };
};

export const exportConfigurationAsJSON = (id: string): string | null => {
  const configs = getSavedConfigurations();
  const config = configs.find(c => c.id === id);
  return config ? JSON.stringify(config, null, 2) : null;
};

export const importConfigurationFromJSON = (jsonString: string): SavedConfiguration | null => {
  try {
    const data = JSON.parse(jsonString) as SavedConfiguration;
    const existing = getSavedConfigurations();
    const newConfig: SavedConfiguration = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    existing.push(newConfig);
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(existing));
    return newConfig;
  } catch {
    return null;
  }
};
