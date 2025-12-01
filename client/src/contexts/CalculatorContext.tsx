import React, { createContext, useContext, useState } from 'react';

export interface CalculatorState {
  dataVolumeGB: number;
  concurrency: number;
  selectedTier: "Minimum" | "Balanced" | "Performance";
  queryComplexity: "simple" | "complex";
  ingestionType: "batch" | "streaming";
  advancedMode: boolean;
}

interface CalculatorContextType {
  state: CalculatorState;
  updateState: (newState: Partial<CalculatorState>) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CalculatorState>({
    dataVolumeGB: 1024,
    concurrency: 20,
    selectedTier: "Balanced",
    queryComplexity: "simple",
    ingestionType: "batch",
    advancedMode: false,
  });

  const updateState = (newState: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  return (
    <CalculatorContext.Provider value={{ state, updateState }}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within CalculatorProvider');
  }
  return context;
}
