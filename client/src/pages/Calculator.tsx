'use client';
import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Info, Check, Download, Settings2, Sparkles, Zap, Activity, Input, HelpCircle, TrendingUp, Gauge } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// --- Enhanced Types & Constants ---

type Platform = "fabric" | "synapse" | "databricks";
type QueryComplexity = "simple" | "moderate" | "complex";
type IngestionType = "batch" | "hourly" | "realtime" | "ondemand";
type TierType = "Minimum" | "Balanced" | "Performance";
type SLARequirement = "best-effort" | "standard" | "premium" | "mission-critical";

interface WorkloadDistribution {
  olap: number;
  oltp: number;
  etl: number;
  ml: number;
  realtime: number;
}

interface PlatformInfo {
  description: string;
  keyFeatures: string[];
  useCases: string[];
  scalingNotes: string;
  maxConcurrentQueries: number;
  maxUsers: number;
  storageIncluded: string;
}

interface SizingResult {
  sku: string;
  cores: number;
  memory: string;
  storage: string;
  cost: number;
  tier: TierType;
  concurrentQueries: number;
  maxUsers: number;
  platformInfo: PlatformInfo;
}

// SKU Definitions with Enhanced Specifications
const FABRIC_SKUS = [
  { name: "F2", cores: 2, cost: 262.8, cu: 2 },
  { name: "F4", cores: 4, cost: 525.6, cu: 4 },
  { name: "F8", cores: 8, cost: 1051.2, cu: 8 },
  { name: "F16", cores: 16, cost: 2102.4, cu: 16 },
  { name: "F32", cores: 32, cost: 4204.8, cu: 32 },
  { name: "F64", cores: 64, cost: 8409.6, cu: 64 },
  { name: "F128", cores: 128, cost: 16819.2, cu: 128 },
  { name: "F256", cores: 256, cost: 33638.4, cu: 256 },
  { name: "F512", cores: 512, cost: 67276.8, cu: 512 },
];

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

// --- Helper Functions ---

const getComplexityMultiplier = (complexity: QueryComplexity): number => {
  switch (complexity) {
    case "simple": return 1.0;
    case "moderate": return 1.5;
    case "complex": return 2.5;
    default: return 1.0;
  }
};

const getIngestionMultiplier = (ingestion: IngestionType): number => {
  switch (ingestion) {
    case "batch": return 1.0;
    case "hourly": return 1.15;
    case "realtime": return 1.4;
    case "ondemand": return 0.9;
    default: return 1.0;
  }
};

const getSLAMultiplier = (sla: SLARequirement): number => {
  switch (sla) {
    case "best-effort": return 0.8;
    case "standard": return 1.0;
    case "premium": return 1.3;
    case "mission-critical": return 1.6;
    default: return 1.0;
  }
};

const getWorkloadMultiplier = (distribution: WorkloadDistribution): number => {
  const weights = {
    olap: (distribution.olap / 100) * 1.2,
    oltp: (distribution.oltp / 100) * 1.5,
    etl: (distribution.etl / 100) * 1.3,
    ml: (distribution.ml / 100) * 2.0,
    realtime: (distribution.realtime / 100) * 1.8,
  };
  return Object.values(weights).reduce((a, b) => a + b, 0);
};

const getGrowthAdjustment = (growthRate: number): number => {
  return 1 + growthRate / 100;
};

const formatDataVolume = (gb: number): string => {
  if (gb >= 1024) {
    return `${(gb / 1024).toFixed(2)} TB`;
  }
  return `${gb} GB`;
};

const convertToTB = (gb: number): number => {
  return gb / 1024;
};

// Enhanced Calculation Functions with New Parameters
const calculateFabric = (
  tb: number,
  users: number,
  complexity: QueryComplexity,
  ingestion: IngestionType,
  tier: TierType,
  peakUsageMultiplier: number,
  slaRequirement: SLARequirement,
  growthRate: number,
  workloadDistribution: WorkloadDistribution
): SizingResult => {
  let score = (tb * 2) + (users * 0.5);
  
  // Apply multipliers
  score *= getComplexityMultiplier(complexity);
  score *= getIngestionMultiplier(ingestion);
  score *= peakUsageMultiplier;
  score *= getSLAMultiplier(slaRequirement);
  score *= getWorkloadMultiplier(workloadDistribution);
  score *= getGrowthAdjustment(growthRate);
  
  // Apply tier multiplier
  if (tier === "Minimum") score *= 0.6;
  else if (tier === "Performance") score *= 1.5;
  
  let skuIndex = 0;
  if (score < 10) skuIndex = 1;
  else if (score < 30) skuIndex = 2;
  else if (score < 60) skuIndex = 3;
  else if (score < 120) skuIndex = 4;
  else if (score < 250) skuIndex = 5;
  else if (score < 500) skuIndex = 6;
  else skuIndex = 7;

  const sku = FABRIC_SKUS[skuIndex];
  const concurrentQueries = sku.cu * 2;
  const maxUsers = sku.cu * 10;
  
  return {
    sku: sku.name,
    cores: sku.cores,
    memory: `${sku.cores * 8} GB`,
    storage: "OneLake (Unlimited)",
    cost: sku.cost,
    tier: tier,
    concurrentQueries,
    maxUsers,
    platformInfo: {
      description: "Microsoft Fabric is an integrated analytics platform combining Power BI, Spark, Data Warehouse, and Real-time Analytics.",
      keyFeatures: [
        "Integrated Analytics Platform",
        "Power BI Integration",
        "Apache Spark Support",
        "Data Warehouse",
        "Real-time Analytics",
        "Surge Protection",
        "OneLake Storage"
      ],
      useCases: [
        "Integrated analytics with Power BI",
        "Spark-based data processing",
        "Data warehouse analytics",
        "Real-time data streaming",
        "Multi-workload analytics"
      ],
      scalingNotes: "Linear performance scaling with CU increases. Surge protection prevents cost overruns. Monitor via Capacity Metrics app.",
      maxConcurrentQueries: concurrentQueries,
      maxUsers: maxUsers,
      storageIncluded: `${sku.cu * 10} GB`
    }
  };
};

const calculateSynapse = (
  tb: number,
  users: number,
  complexity: QueryComplexity,
  ingestion: IngestionType,
  tier: TierType,
  peakUsageMultiplier: number,
  slaRequirement: SLARequirement,
  growthRate: number,
  workloadDistribution: WorkloadDistribution
): SizingResult => {
  let requiredSlots = users * (getComplexityMultiplier(complexity) > 1.5 ? 5 : 3);
  let requiredDwu = Math.max(tb * 100, requiredSlots * 15);
  
  // Apply multipliers
  requiredDwu *= getIngestionMultiplier(ingestion);
  requiredDwu *= peakUsageMultiplier;
  requiredDwu *= getSLAMultiplier(slaRequirement);
  requiredDwu *= getWorkloadMultiplier(workloadDistribution);
  requiredDwu *= getGrowthAdjustment(growthRate);
  
  // Apply tier multiplier
  if (tier === "Minimum") requiredDwu *= 0.6;
  else if (tier === "Performance") requiredDwu *= 1.5;
  
  let sku = SYNAPSE_SKUS.find(s => s.dwu >= requiredDwu) || SYNAPSE_SKUS[SYNAPSE_SKUS.length - 1];
  
  const concurrentQueries = Math.max(4, Math.floor(sku.dwu / 100));
  const maxUsers = Math.max(10, Math.floor(sku.dwu / 50));

  return {
    sku: sku.name,
    cores: Math.round(sku.dwu / 15),
    memory: `${Math.round(sku.dwu * 0.6)} GB`,
    storage: "240 TB (Separate Billing)",
    cost: sku.cost,
    tier: tier,
    concurrentQueries,
    maxUsers,
    platformInfo: {
      description: "Azure Synapse Analytics is an enterprise data warehouse with advanced query optimization and workload management.",
      keyFeatures: [
        "Enterprise Data Warehouse",
        "Pause/Resume Compute",
        "Workload Management",
        "Advanced Query Optimization",
        "Separate Compute & Storage",
        "Massive Parallel Processing",
        "PolyBase Integration"
      ],
      useCases: [
        "Enterprise data warehouse",
        "Complex analytics queries",
        "BI and reporting",
        "Data integration",
        "Large-scale data processing"
      ],
      scalingNotes: "Pause compute to save costs. Linear performance scaling with DWU increases. Requires minimum 1TB for accurate testing.",
      maxConcurrentQueries: concurrentQueries,
      maxUsers: maxUsers,
      storageIncluded: "240 TB"
    }
  };
};

const calculateDatabricks = (
  tb: number,
  users: number,
  complexity: QueryComplexity,
  ingestion: IngestionType,
  tier: TierType,
  peakUsageMultiplier: number,
  slaRequirement: SLARequirement,
  growthRate: number,
  workloadDistribution: WorkloadDistribution
): SizingResult => {
  let score = (tb * 1.5) + (users * 0.8);
  
  // Apply multipliers
  score *= getComplexityMultiplier(complexity);
  score *= getIngestionMultiplier(ingestion);
  score *= peakUsageMultiplier;
  score *= getSLAMultiplier(slaRequirement);
  score *= getWorkloadMultiplier(workloadDistribution);
  score *= getGrowthAdjustment(growthRate);
  
  // Apply tier multiplier
  if (tier === "Minimum") score *= 0.6;
  else if (tier === "Performance") score *= 1.5;
  
  let skuIndex = 0;
  if (score < 20) skuIndex = 1;
  else if (score < 50) skuIndex = 2;
  else if (score < 100) skuIndex = 3;
  else if (score < 200) skuIndex = 4;
  else if (score < 400) skuIndex = 5;
  else skuIndex = 6;

  const sku = DATABRICKS_CLUSTERS[skuIndex];
  const concurrentQueries = sku.dbus / 2;
  const maxUsers = sku.dbus;

  return {
    sku: sku.name,
    cores: sku.dbus * 2,
    memory: `${sku.dbus * 8} GB`,
    storage: "Data Lake (Separate Billing)",
    cost: sku.cost,
    tier: tier,
    concurrentQueries,
    maxUsers,
    platformInfo: {
      description: "Azure Databricks is a data lakehouse platform supporting data engineering, analytics, and machine learning.",
      keyFeatures: [
        "Data Lakehouse Architecture",
        "Apache Spark & Delta Lake",
        "Machine Learning & AI",
        "Serverless Option",
        "Autoscaling",
        "Photon Engine",
        "Collaborative Notebooks"
      ],
      useCases: [
        "Data lakehouse implementation",
        "Machine learning pipelines",
        "Advanced analytics",
        "Data engineering",
        "Real-time streaming analytics"
      ],
      scalingNotes: "Autoscaling reduces idle costs. Serverless option recommended for most workloads. Photon engine beneficial for SQL and complex transformations.",
      maxConcurrentQueries: concurrentQueries,
      maxUsers: maxUsers,
      storageIncluded: "0 (Billed separately)"
    }
  };
};

// --- Components ---

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
  <div className="group relative inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border border-white/20 rounded-lg text-xs text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
      {text}
    </div>
  </div>
);

const ResultCard = ({ title, result, icon: Icon }: { title: string; result: SizingResult; icon: any }) => (
  <div className="glass-panel rounded-2xl p-6 flex flex-col h-full transition-all hover:scale-[1.02] hover:shadow-2xl hover:border-teal-500/30 group">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500/20 to-indigo-500/20 text-teal-300">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-bold font-heading tracking-wide text-white">{title}</h3>
    </div>
    
    <div className="space-y-6 flex-grow">
      <div>
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Recommended SKU</div>
        <div className="text-4xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          {result.sku}
        </div>
      </div>

      <div className="space-y-4 font-mono text-sm">
        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/30 border border-white/5">
          <span className="text-slate-400">Compute Cores</span>
          <span className="font-bold text-teal-200">{result.cores} vCores</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/30 border border-white/5">
          <span className="text-slate-400">Memory</span>
          <span className="font-bold text-indigo-200">{result.memory}</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/30 border border-white/5">
          <span className="text-slate-400">Max Concurrent Queries</span>
          <span className="font-bold text-purple-200">{result.concurrentQueries}</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg bg-slate-900/30 border border-white/5">
          <span className="text-slate-400">Est. Cost</span>
          <span className="font-bold text-white">${result.cost.toLocaleString()}/mo</span>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <div className="text-xs font-medium text-slate-400 uppercase mb-2">Platform Highlights</div>
        <ul className="space-y-1 text-xs text-slate-300">
          {result.platformInfo.keyFeatures.slice(0, 3).map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check size={12} className="text-teal-400" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
    
    <div className="mt-6 pt-4 border-t border-white/10">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-400 uppercase">Tier</span>
        <span className="text-sm font-bold text-white">{result.tier}</span>
      </div>
      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 to-indigo-500" 
          style={{ width: result.tier === "Performance" ? "90%" : result.tier === "Balanced" ? "60%" : "30%" }}
        ></div>
      </div>
    </div>
  </div>
);

export default function Calculator() {
  // Load state from localStorage
  const savedState = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('calculatorState') || '{}') : {};
  
  // Basic State
  const [dataVolumeGB, setDataVolumeGB] = useState([savedState.dataVolumeGB || 1024]);
  const [concurrency, setConcurrency] = useState([savedState.concurrency || 20]);
  const [advancedMode, setAdvancedMode] = useState(savedState.advancedMode || false);
  const [queryComplexity, setQueryComplexity] = useState<QueryComplexity>(savedState.queryComplexity || "simple");
  const [ingestionType, setIngestionType] = useState<IngestionType>(savedState.ingestionType || "batch");
  const [dataVolumeInput, setDataVolumeInput] = useState((savedState.dataVolumeGB || 1024).toString());
  const [selectedTier, setSelectedTier] = useState<TierType>(savedState.selectedTier || "Balanced");

  // Advanced Parameters
  const [peakUsageMultiplier, setPeakUsageMultiplier] = useState([savedState.peakUsageMultiplier || 1.5]);
  const [slaRequirement, setSLARequirement] = useState<SLARequirement>(savedState.slaRequirement || "standard");
  const [growthRate, setGrowthRate] = useState([savedState.growthRate || 20]);
  const [dataRetentionDays, setDataRetentionDays] = useState(savedState.dataRetentionDays || 90);
  const [workloadDistribution, setWorkloadDistribution] = useState<WorkloadDistribution>(
    savedState.workloadDistribution || { olap: 50, oltp: 20, etl: 20, ml: 5, realtime: 5 }
  );

  // Results
  const [fabricResult, setFabricResult] = useState<SizingResult | null>(null);
  const [synapseResult, setSynapseResult] = useState<SizingResult | null>(null);
  const [databricksResult, setDatabricksResult] = useState<SizingResult | null>(null);

  const handleDataVolumeChange = (value: number[]) => {
    setDataVolumeGB(value);
    setDataVolumeInput(value[0].toString());
  };

  const handleDataVolumeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDataVolumeInput(value);
    const numValue = parseInt(value) || 0;
    if (numValue > 0 && numValue <= 512000) {
      setDataVolumeGB([numValue]);
    }
  };

  const handleWorkloadChange = (key: keyof WorkloadDistribution, value: number) => {
    const updated = { ...workloadDistribution, [key]: value };
    const total = Object.values(updated).reduce((a, b) => a + b, 0);
    if (total === 100) {
      setWorkloadDistribution(updated);
    }
  };

  useEffect(() => {
    const tbValue = convertToTB(dataVolumeGB[0]);
    const fabric = calculateFabric(
      tbValue, concurrency[0], queryComplexity, ingestionType, selectedTier,
      peakUsageMultiplier[0], slaRequirement, growthRate[0], workloadDistribution
    );
    const synapse = calculateSynapse(
      tbValue, concurrency[0], queryComplexity, ingestionType, selectedTier,
      peakUsageMultiplier[0], slaRequirement, growthRate[0], workloadDistribution
    );
    const databricks = calculateDatabricks(
      tbValue, concurrency[0], queryComplexity, ingestionType, selectedTier,
      peakUsageMultiplier[0], slaRequirement, growthRate[0], workloadDistribution
    );
    
    setFabricResult(fabric);
    setSynapseResult(synapse);
    setDatabricksResult(databricks);
    
    // Save state to localStorage
    const state = {
      dataVolumeGB: dataVolumeGB[0],
      concurrency: concurrency[0],
      queryComplexity,
      ingestionType,
      selectedTier,
      advancedMode,
      peakUsageMultiplier: peakUsageMultiplier[0],
      slaRequirement,
      growthRate: growthRate[0],
      dataRetentionDays,
      workloadDistribution
    };
    localStorage.setItem('calculatorState', JSON.stringify(state));
  }, [dataVolumeGB, concurrency, queryComplexity, ingestionType, selectedTier, advancedMode, peakUsageMultiplier, slaRequirement, growthRate, dataRetentionDays, workloadDistribution]);

  const handleExport = async () => {
    const element = document.getElementById("calculator-results");
    if (element) {
      const canvas = await html2canvas(element, {
        backgroundColor: "#0f172a",
        scale: 2
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("dwh-sizing-report-comprehensive.pdf");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-teal-500/30">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Activity className="text-white h-5 w-5" />
            </div>
            <span className="text-lg font-bold font-heading tracking-tight text-white">Capacity<span className="text-teal-400">Planner</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-400">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              v3.0 Advanced
            </div>
            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-slate-300" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Inputs Section */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-8">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-teal-400" />
                Configuration
              </h2>
              <div className="flex items-center gap-2">
                <Tooltip text="Enable advanced sizing parameters for more accurate recommendations">
                  <Label htmlFor="advanced-mode" className="text-xs font-bold uppercase text-slate-400 cursor-pointer flex items-center gap-1">
                    Advanced <HelpCircle size={12} />
                  </Label>
                </Tooltip>
                <Switch id="advanced-mode" checked={advancedMode} onCheckedChange={setAdvancedMode} className="data-[state=checked]:bg-teal-500" />
              </div>
            </div>
            
            {/* Basic Parameters */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-slate-300">Data Volume</Label>
                <span className="text-lg font-bold font-mono text-teal-300 bg-teal-500/10 px-3 py-1 rounded-md border border-teal-500/20">{formatDataVolume(dataVolumeGB[0])}</span>
              </div>
              <Slider
                value={dataVolumeGB}
                onValueChange={handleDataVolumeChange}
                max={512000}
                step={1}
                className="py-4"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="512000"
                  value={dataVolumeInput}
                  onChange={handleDataVolumeInputChange}
                  placeholder="Enter value in GB"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
                />
                <span className="px-3 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-slate-400 font-mono text-sm flex items-center">GB</span>
              </div>
              <p className="text-xs text-slate-500">Total compressed data stored. Enter value in GB (e.g., 100 for 100GB, 1024 for 1TB).</p>
            </div>

            {/* Concurrent Users */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-slate-300">Concurrent Users</Label>
                <span className="text-lg font-bold font-mono text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-md border border-indigo-500/20">{concurrency[0]}</span>
              </div>
              <Slider
                value={concurrency}
                onValueChange={setConcurrency}
                max={200}
                step={5}
                className="py-4"
              />
              <p className="text-xs text-slate-500">Active users running queries simultaneously.</p>
            </div>

            {/* Basic Advanced Options */}
            {advancedMode && (
              <div className="space-y-6 pt-6 border-t border-white/10 animate-accordion-down overflow-hidden">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    Query Complexity
                    <Tooltip text="Simple: Basic aggregations, Moderate: Joins and subqueries, Complex: Window functions and CTEs">
                      <HelpCircle size={14} className="text-slate-500" />
                    </Tooltip>
                  </Label>
                  <RadioGroup value={queryComplexity} onValueChange={(v) => setQueryComplexity(v as QueryComplexity)} className="grid grid-cols-3 gap-2">
                    {(["simple", "moderate", "complex"] as const).map((level) => (
                      <div key={level} className="flex items-center space-x-2 px-2 py-2 rounded-lg border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                        <RadioGroupItem value={level} id={level} />
                        <Label htmlFor={level} className="cursor-pointer text-xs text-slate-300 capitalize whitespace-nowrap">{level}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    Data Refresh Frequency
                    <Tooltip text="Batch: Daily, Hourly: Every hour, Real-time: Continuous, On-demand: As needed">
                      <HelpCircle size={14} className="text-slate-500" />
                    </Tooltip>
                  </Label>
                  <RadioGroup value={ingestionType} onValueChange={(v) => setIngestionType(v as IngestionType)} className="grid grid-cols-2 gap-2">
                    {(["batch", "hourly", "realtime", "ondemand"] as const).map((type) => (
                      <div key={type} className="flex items-center space-x-2 px-2 py-2 rounded-lg border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                        <RadioGroupItem value={type} id={type} />
                        <Label htmlFor={type} className="cursor-pointer text-xs text-slate-300 capitalize whitespace-nowrap">{type.replace("-", " ")}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Peak Usage Multiplier */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      Peak Usage Multiplier
                      <Tooltip text="Factor for peak vs. average usage (1x = average, 5x = extreme peaks)">
                        <HelpCircle size={14} className="text-slate-500" />
                      </Tooltip>
                    </Label>
                    <span className="text-sm font-bold text-teal-300">{peakUsageMultiplier[0].toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={peakUsageMultiplier}
                    onValueChange={setPeakUsageMultiplier}
                    min={1}
                    max={5}
                    step={0.1}
                    className="py-4"
                  />
                </div>

                {/* SLA Requirement */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    SLA Requirement
                    <Tooltip text="Service level agreement: Best-effort (80%), Standard (100%), Premium (130%), Mission-critical (160%)">
                      <HelpCircle size={14} className="text-slate-500" />
                    </Tooltip>
                  </Label>
                  <RadioGroup value={slaRequirement} onValueChange={(v) => setSLARequirement(v as SLARequirement)} className="grid grid-cols-2 gap-2">
                    {(["best-effort", "standard", "premium", "mission-critical"] as const).map((sla) => (
                      <div key={sla} className="flex items-center space-x-1 px-2 py-2 rounded-lg border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                        <RadioGroupItem value={sla} id={sla} />
                        <Label htmlFor={sla} className="cursor-pointer text-xs text-slate-300 capitalize whitespace-nowrap">{sla.replace("-", " ")}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Growth Rate */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      Annual Growth Rate
                      <Tooltip text="Plan for future capacity needs (0-100% annual growth)">
                        <HelpCircle size={14} className="text-slate-500" />
                      </Tooltip>
                    </Label>
                    <span className="text-sm font-bold text-indigo-300">{growthRate[0]}%</span>
                  </div>
                  <Slider
                    value={growthRate}
                    onValueChange={setGrowthRate}
                    min={0}
                    max={100}
                    step={5}
                    className="py-4"
                  />
                </div>

                {/* Data Retention */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    Data Retention Period
                    <Tooltip text="How long to retain historical data (affects storage requirements)">
                      <HelpCircle size={14} className="text-slate-500" />
                    </Tooltip>
                  </Label>
                  <select 
                    value={dataRetentionDays} 
                    onChange={(e) => setDataRetentionDays(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-white/10 text-white focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
                  >
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>1 year</option>
                    <option value={730}>2 years</option>
                  </select>
                </div>

                {/* Workload Distribution */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <Label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    Workload Distribution
                    <Tooltip text="Percentage breakdown of different workload types">
                      <HelpCircle size={14} className="text-slate-500" />
                    </Tooltip>
                  </Label>
                  <div className="space-y-2 text-xs">
                    {(["olap", "oltp", "etl", "ml", "realtime"] as const).map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <label className="w-16 text-slate-400 capitalize">{type}</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={workloadDistribution[type]}
                          onChange={(e) => handleWorkloadChange(type, parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="w-10 text-right font-mono text-teal-300">{workloadDistribution[type]}%</span>
                      </div>
                    ))}
                    <div className="text-slate-500 text-right">
                      Total: {Object.values(workloadDistribution).reduce((a, b) => a + b, 0)}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-8 space-y-8" id="calculator-results">
          {/* Tier Selection Buttons */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold font-heading text-white">Sizing Tier</h3>
            <div className="grid grid-cols-3 gap-3">
              {(["Minimum", "Balanced", "Performance"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-4 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all border ${
                    selectedTier === tier
                      ? "bg-teal-500/20 border-teal-500/50 text-teal-300 shadow-lg shadow-teal-500/20"
                      : "bg-slate-900/30 border-white/10 text-slate-300 hover:border-white/20"
                  }`}
                >
                  {tier === "Balanced" && selectedTier === tier && "✓ "}
                  {tier === "Minimum" && "Minimum Viable"}
                  {tier === "Balanced" && "Balanced Choice"}
                  {tier === "Performance" && "High Performance"}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              {selectedTier === "Minimum" && "Cost-effective option with basic performance. Suitable for non-critical workloads and POCs."}
              {selectedTier === "Balanced" && "Recommended option balancing cost and performance. Suitable for most production workloads."}
              {selectedTier === "Performance" && "Premium option with maximum performance. Suitable for mission-critical workloads with strict SLAs."}
            </p>
          </div>

          {/* Results Cards */}
          {fabricResult && synapseResult && databricksResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              <ResultCard title="Microsoft Fabric" result={fabricResult} icon={Sparkles} />
              <ResultCard title="Azure Synapse" result={synapseResult} icon={Activity} />
              <ResultCard title="Databricks" result={databricksResult} icon={Zap} />
            </div>
          )}
          
          <div className="glass-panel rounded-xl p-6 flex items-start gap-4 border-l-4 border-l-teal-500">
            <div className="p-2 bg-teal-500/10 rounded-full">
              <Info className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Advanced Sizing Considerations</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                These recommendations incorporate {advancedMode ? "all advanced parameters including peak usage multiplier, SLA requirements, growth projections, and workload distribution." : "standard performance benchmarks."}
                {advancedMode && queryComplexity !== 'simple' && ` Query complexity modifier (${getComplexityMultiplier(queryComplexity)}x) applied.`}
                {advancedMode && ingestionType !== 'batch' && ` Ingestion frequency modifier (${getIngestionMultiplier(ingestionType).toFixed(2)}x) included.`}
                {advancedMode && peakUsageMultiplier[0] !== 1 && ` Peak usage multiplier (${peakUsageMultiplier[0].toFixed(1)}x) factored in.`}
                Actual production requirements may vary based on data skew, query patterns, and specific use cases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
