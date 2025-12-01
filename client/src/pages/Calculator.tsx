import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Info, Check, Download, Settings2, Sparkles, Zap, Activity } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// --- Types & Constants ---

type Platform = "fabric" | "synapse" | "databricks";
type QueryComplexity = "simple" | "complex";
type IngestionType = "batch" | "streaming";

interface SizingResult {
  sku: string;
  cores: number;
  memory: string;
  storage: string;
  cost: number;
  tier: "Minimum" | "Balanced" | "Performance";
}

const FABRIC_SKUS = [
  { name: "F2", cores: 2, cost: 262.8 },
  { name: "F4", cores: 4, cost: 525.6 },
  { name: "F8", cores: 8, cost: 1051.2 },
  { name: "F16", cores: 16, cost: 2102.4 },
  { name: "F32", cores: 32, cost: 4204.8 },
  { name: "F64", cores: 64, cost: 8409.6 },
  { name: "F128", cores: 128, cost: 16819.2 },
  { name: "F256", cores: 256, cost: 33638.4 },
  { name: "F512", cores: 512, cost: 67276.8 },
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
  { name: "2X-Small", dbus: 4, cost: 250 }, // Approx
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

const calculateFabric = (tb: number, users: number, complexity: QueryComplexity, ingestion: IngestionType): SizingResult => {
  let score = (tb * 2) + (users * 0.5);
  if (complexity === "complex") score *= 1.5;
  if (ingestion === "streaming") score *= 1.2;
  
  let skuIndex = 0;
  if (score < 10) skuIndex = 1;
  else if (score < 30) skuIndex = 2;
  else if (score < 60) skuIndex = 3;
  else if (score < 120) skuIndex = 4;
  else if (score < 250) skuIndex = 5;
  else if (score < 500) skuIndex = 6;
  else skuIndex = 7;

  const sku = FABRIC_SKUS[skuIndex];
  
  return {
    sku: sku.name,
    cores: sku.cores,
    memory: `${sku.cores * 8} GB`,
    storage: "OneLake (Unlimited)",
    cost: sku.cost,
    tier: complexity === "complex" ? "Performance" : "Balanced"
  };
};

const calculateSynapse = (tb: number, users: number, complexity: QueryComplexity, ingestion: IngestionType): SizingResult => {
  let requiredSlots = users * (complexity === "complex" ? 5 : 3);
  let requiredDwu = Math.max(tb * 100, requiredSlots * 15);
  if (ingestion === "streaming") requiredDwu *= 1.3;
  
  let sku = SYNAPSE_SKUS.find(s => s.dwu >= requiredDwu) || SYNAPSE_SKUS[SYNAPSE_SKUS.length - 1];

  return {
    sku: sku.name,
    cores: Math.round(sku.dwu / 15),
    memory: `${Math.round(sku.dwu * 0.6)} GB`,
    storage: "Unlimited",
    cost: sku.cost,
    tier: complexity === "complex" ? "Performance" : "Balanced"
  };
};

const calculateDatabricks = (tb: number, users: number, complexity: QueryComplexity, ingestion: IngestionType): SizingResult => {
  let score = (tb * 1.5) + (users * 0.8);
  if (complexity === "complex") score *= 1.4;
  if (ingestion === "streaming") score *= 1.1;
  
  let skuIndex = 0;
  if (score < 20) skuIndex = 1;
  else if (score < 50) skuIndex = 2;
  else if (score < 100) skuIndex = 3;
  else if (score < 200) skuIndex = 4;
  else if (score < 400) skuIndex = 5;
  else skuIndex = 6;

  const sku = DATABRICKS_CLUSTERS[skuIndex];

  return {
    sku: sku.name,
    cores: sku.dbus * 2,
    memory: `${sku.dbus * 8} GB`,
    storage: "Data Lake",
    cost: sku.cost,
    tier: complexity === "complex" ? "Performance" : "Balanced"
  };
};

// --- Components ---

const ResultCard = ({ title, result, icon: Icon }: { title: string, result: SizingResult, icon: any }) => (
  <div className="glass-panel rounded-2xl p-6 flex flex-col h-full transition-all hover:scale-[1.02] hover:shadow-2xl hover:border-teal-500/30 group">
    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500/20 to-indigo-500/20 text-teal-300">
          <Icon size={20} />
        </div>
        <h3 className="text-lg font-bold font-heading tracking-wide text-white">{title}</h3>
      </div>
      <div className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
        Recommended
      </div>
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
          <span className="text-slate-400">Est. Cost</span>
          <span className="font-bold text-white">${result.cost.toLocaleString()}/mo</span>
        </div>
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
  const [dataVolume, setDataVolume] = useState([50]);
  const [concurrency, setConcurrency] = useState([20]);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [queryComplexity, setQueryComplexity] = useState<QueryComplexity>("simple");
  const [ingestionType, setIngestionType] = useState<IngestionType>("batch");

  const [fabricResult, setFabricResult] = useState<SizingResult>(calculateFabric(50, 20, "simple", "batch"));
  const [synapseResult, setSynapseResult] = useState<SizingResult>(calculateSynapse(50, 20, "simple", "batch"));
  const [databricksResult, setDatabricksResult] = useState<SizingResult>(calculateDatabricks(50, 20, "simple", "batch"));

  useEffect(() => {
    setFabricResult(calculateFabric(dataVolume[0], concurrency[0], queryComplexity, ingestionType));
    setSynapseResult(calculateSynapse(dataVolume[0], concurrency[0], queryComplexity, ingestionType));
    setDatabricksResult(calculateDatabricks(dataVolume[0], concurrency[0], queryComplexity, ingestionType));
  }, [dataVolume, concurrency, queryComplexity, ingestionType]);

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
      pdf.save("dwh-sizing-report-fluid.pdf");
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
              v2.1 Live
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
                <Label htmlFor="advanced-mode" className="text-xs font-bold uppercase text-slate-400 cursor-pointer">Advanced</Label>
                <Switch id="advanced-mode" checked={advancedMode} onCheckedChange={setAdvancedMode} className="data-[state=checked]:bg-teal-500" />
              </div>
            </div>
            
            {/* Data Volume Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-slate-300">Data Volume</Label>
                <span className="text-lg font-bold font-mono text-teal-300 bg-teal-500/10 px-3 py-1 rounded-md border border-teal-500/20">{dataVolume[0]} TB</span>
              </div>
              <Slider
                value={dataVolume}
                onValueChange={setDataVolume}
                max={500}
                step={10}
                className="py-4"
              />
              <p className="text-xs text-slate-500">Total compressed data stored in OneLake/ADLS.</p>
            </div>

            {/* Concurrency Slider */}
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

            {/* Advanced Options */}
            {advancedMode && (
              <div className="space-y-6 pt-6 border-t border-white/10 animate-accordion-down overflow-hidden">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-300">Query Complexity</Label>
                  <RadioGroup value={queryComplexity} onValueChange={(v) => setQueryComplexity(v as QueryComplexity)} className="grid grid-cols-2 gap-3">
                    <div className={`flex items-center justify-center space-x-2 border rounded-lg p-3 cursor-pointer transition-all ${queryComplexity === 'simple' ? 'bg-teal-500/20 border-teal-500/50' : 'bg-slate-900/30 border-white/5 hover:bg-white/5'}`}>
                      <RadioGroupItem value="simple" id="simple" className="sr-only" />
                      <Label htmlFor="simple" className="cursor-pointer text-sm font-medium text-white">Simple</Label>
                    </div>
                    <div className={`flex items-center justify-center space-x-2 border rounded-lg p-3 cursor-pointer transition-all ${queryComplexity === 'complex' ? 'bg-teal-500/20 border-teal-500/50' : 'bg-slate-900/30 border-white/5 hover:bg-white/5'}`}>
                      <RadioGroupItem value="complex" id="complex" className="sr-only" />
                      <Label htmlFor="complex" className="cursor-pointer text-sm font-medium text-white">Complex</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-300">Ingestion Type</Label>
                  <RadioGroup value={ingestionType} onValueChange={(v) => setIngestionType(v as IngestionType)} className="grid grid-cols-2 gap-3">
                    <div className={`flex items-center justify-center space-x-2 border rounded-lg p-3 cursor-pointer transition-all ${ingestionType === 'batch' ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-slate-900/30 border-white/5 hover:bg-white/5'}`}>
                      <RadioGroupItem value="batch" id="batch" className="sr-only" />
                      <Label htmlFor="batch" className="cursor-pointer text-sm font-medium text-white">Batch</Label>
                    </div>
                    <div className={`flex items-center justify-center space-x-2 border rounded-lg p-3 cursor-pointer transition-all ${ingestionType === 'streaming' ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-slate-900/30 border-white/5 hover:bg-white/5'}`}>
                      <RadioGroupItem value="streaming" id="streaming" className="sr-only" />
                      <Label htmlFor="streaming" className="cursor-pointer text-sm font-medium text-white">Streaming</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-8 space-y-8" id="calculator-results">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <ResultCard title="Microsoft Fabric" result={fabricResult} icon={Sparkles} />
            <ResultCard title="Azure Synapse" result={synapseResult} icon={Activity} />
            <ResultCard title="Databricks" result={databricksResult} icon={Zap} />
          </div>
          
          <div className="glass-panel rounded-xl p-6 flex items-start gap-4 border-l-4 border-l-teal-500">
            <div className="p-2 bg-teal-500/10 rounded-full">
              <Info className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Sizing Recommendation Logic</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                These estimates are based on standard performance benchmarks. 
                {advancedMode && queryComplexity === 'complex' && " Complex query modifier (+50% compute) applied."}
                {advancedMode && ingestionType === 'streaming' && " Streaming ingestion buffer (+20-30%) included."}
                {" "}Actual production requirements may vary based on data skew, caching efficiency, and specific workload patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
