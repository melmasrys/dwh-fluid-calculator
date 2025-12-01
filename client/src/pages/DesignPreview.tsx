import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Database, Server, CheckCircle2, Info } from "lucide-react";

export default function DesignPreview() {
  return (
    <div className="min-h-screen w-full">
      {/* Navigation / Toggle Header */}
      <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Design Style Preview</h1>
        <div className="text-sm text-gray-500">Scroll down to compare styles</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* LEFT SIDE: FLUID INTELLIGENCE */}
        <div className="relative bg-[#0f172a] text-white overflow-hidden border-r border-gray-800">
          {/* Background Effects */}
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 p-8 md:p-12 flex flex-col gap-12">
            {/* Header Section */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-teal-300 text-xs font-medium font-['Plus_Jakarta_Sans']">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                Fluid Intelligence
              </div>
              <h2 className="text-5xl md:text-6xl font-bold font-['Outfit'] tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                Sizing <br/>
                <span className="text-teal-400">Reimagined</span>
              </h2>
              <p className="text-lg text-slate-300 font-['Plus_Jakarta_Sans'] max-w-md leading-relaxed">
                Experience the next generation of capacity planning. Organic flows meet enterprise precision in a glass-morphic interface.
              </p>
            </div>

            {/* Interactive Card Demo */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold font-['Outfit'] text-white">Fabric F64</h3>
                    <p className="text-sm text-slate-400 font-['Plus_Jakarta_Sans']">Recommended Capacity</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                    <Database size={20} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-['DM_Mono'] text-slate-300">
                      <span>Data Volume</span>
                      <span>2.4 TB</span>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div className="h-full w-[60%] bg-gradient-to-r from-teal-400 to-teal-600 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <div className="text-xs text-slate-400 font-['Plus_Jakarta_Sans'] mb-1">Est. Cost</div>
                      <div className="text-lg font-bold font-['DM_Mono'] text-white">$5,430<span className="text-xs text-slate-500 font-normal">/mo</span></div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <div className="text-xs text-slate-400 font-['Plus_Jakarta_Sans'] mb-1">Performance</div>
                      <div className="text-lg font-bold font-['DM_Mono'] text-teal-400">High</div>
                    </div>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white border-0 shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all duration-300 font-['Plus_Jakarta_Sans']">
                    View Detailed Analysis <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: ARCHITECTURAL CLARITY */}
        <div className="bg-white text-black border-l border-gray-200 flex flex-col">
          <div className="p-8 md:p-12 flex flex-col gap-12 h-full">
            
            {/* Header Section */}
            <div className="space-y-8 border-b-4 border-black pb-8">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-black"></div>
                <span className="text-xs font-bold tracking-widest uppercase font-['Inter']">Style 02 // Architectural Clarity</span>
              </div>
              
              <h2 className="text-6xl md:text-7xl font-black font-['Inter'] tracking-tighter leading-none">
                DATA<br/>
                SIZING<br/>
                CALC.
              </h2>
              
              <p className="text-xl font-['Inter'] font-medium max-w-md leading-snug text-gray-600">
                Precision engineering for data infrastructure. <br/>
                <span className="text-black bg-yellow-300 px-1">Objective. Minimal. Functional.</span>
              </p>
            </div>

            {/* Interactive Card Demo */}
            <div className="border-2 border-black p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-black text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold font-['JetBrains_Mono'] uppercase">SKU_RECOMMENDATION</h3>
                <div className="px-2 py-1 bg-white text-black text-xs font-bold font-['JetBrains_Mono']">STATUS: OPTIMAL</div>
              </div>
              
              <div className="p-6 bg-white space-y-8">
                <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Target Platform</div>
                    <div className="text-3xl font-black font-['Inter']">Fabric F64</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Capacity Units</div>
                    <div className="text-3xl font-black font-['JetBrains_Mono']">64 CU</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold font-['Inter'] uppercase">Data Volume Load</label>
                    <span className="text-sm font-bold font-['JetBrains_Mono']">2.4 TB</span>
                  </div>
                  <div className="h-4 w-full bg-gray-100 border border-black relative">
                    <div className="absolute top-0 left-0 h-full w-[60%] bg-black"></div>
                    {/* Grid lines on progress bar */}
                    <div className="absolute top-0 left-[25%] h-full w-px bg-white mix-blend-difference"></div>
                    <div className="absolute top-0 left-[50%] h-full w-px bg-white mix-blend-difference"></div>
                    <div className="absolute top-0 left-[75%] h-full w-px bg-white mix-blend-difference"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-0 border border-black">
                  <div className="p-4 border-r border-black">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Est. Monthly Cost</div>
                    <div className="text-xl font-bold font-['JetBrains_Mono']">$5,430.00</div>
                  </div>
                  <div className="p-4 bg-gray-50">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-2">Performance Tier</div>
                    <div className="text-xl font-bold font-['Inter'] text-blue-600">HIGH_PRIORITY</div>
                  </div>
                </div>

                <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-none h-14 text-lg font-bold font-['Inter'] uppercase tracking-wide border-2 border-transparent hover:border-black hover:bg-white hover:text-black transition-colors">
                  Generate Report
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
