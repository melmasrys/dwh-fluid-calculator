import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowRight, BarChart3, Box, CheckCircle2, ChevronDown, ChevronUp, Cpu, Database, DollarSign, Info, Layers, Zap, Server, Download } from "lucide-react";
import { exportToPdf } from "@/lib/pdf-export";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

// Sizing Card Component with Toggle
function SizingCard({ 
  title, 
  fabricSku, 
  databricksSku, 
  description, 
  pros, 
  isRecommended = false,
  details 
}: { 
  title: string, 
  fabricSku: string, 
  databricksSku: string, 
  description: string, 
  pros: { icon: any, text: string, color: string }[], 
  isRecommended?: boolean,
  details: { fabric: string, synapse: string, databricks: string }
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className={cn(
      "glass-card transition-all duration-300",
      isRecommended ? "border-secondary shadow-[0_0_30px_-5px_rgba(13,148,136,0.3)] relative transform scale-105 z-10" : "border-white/5 hover:border-white/20"
    )}>
      {isRecommended && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Recommended
        </div>
      )}
      <CardHeader>
        <CardTitle className={isRecommended ? "text-secondary" : "text-muted-foreground"}>{title}</CardTitle>
        <div className="text-3xl font-bold text-white mt-2">{fabricSku}</div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">Azure Databricks</div>
          <div className={cn("font-bold text-orange-400", isRecommended ? "text-2xl" : "text-xl")}>{databricksSku}</div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground mb-4">
          {pros.map((pro, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <pro.icon className={cn("h-4 w-4", pro.color)} /> 
              <span className={isRecommended ? "text-white" : ""}>{pro.text}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2 text-xs text-muted-foreground hover:text-white hover:bg-white/5"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details" : "Show Details"}
          {showDetails ? <ChevronUp className="ml-2 h-3 w-3" /> : <ChevronDown className="ml-2 h-3 w-3" />}
        </Button>

        {showDetails && (
          <div className="mt-4 space-y-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <Separator className="bg-white/10" />
            <div>
              <span className="font-bold text-secondary block mb-1">Fabric Logic:</span>
              <p className="text-muted-foreground leading-relaxed">{details.fabric}</p>
            </div>
            <div>
              <span className="font-bold text-blue-400 block mb-1">Synapse Logic:</span>
              <p className="text-muted-foreground leading-relaxed">{details.synapse}</p>
            </div>
            <div>
              <span className="font-bold text-orange-400 block mb-1">Databricks Logic:</span>
              <p className="text-muted-foreground leading-relaxed">{details.databricks}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [dataVolume, setDataVolume] = useState(2); // TB
  const [dashboards, setDashboards] = useState(50); // Count
  const [recommendation, setRecommendation] = useState<any>(null);

  // Dynamic Sizing Logic
  useEffect(() => {
    let rec = {
      min: { fabric: "F32", dwu: "DWU500c", dbu: "Small (12 DBU)" },
      rec: { fabric: "F64", dwu: "DWU1000c", dbu: "Medium (24 DBU)" },
      perf: { fabric: "F128", dwu: "DWU1500c", dbu: "Large (40 DBU)" }
    };

    if (dataVolume > 5 || dashboards > 100) {
      rec = {
        min: { fabric: "F64", dwu: "DWU1000c", dbu: "Medium (24 DBU)" },
        rec: { fabric: "F128", dwu: "DWU1500c", dbu: "Large (40 DBU)" },
        perf: { fabric: "F256", dwu: "DWU2000c", dbu: "X-Large (80 DBU)" }
      };
    } else if (dataVolume < 1 && dashboards < 20) {
      rec = {
        min: { fabric: "F8", dwu: "DWU100c", dbu: "2X-Small (4 DBU)" },
        rec: { fabric: "F16", dwu: "DWU200c", dbu: "X-Small (8 DBU)" },
        perf: { fabric: "F32", dwu: "DWU500c", dbu: "Small (12 DBU)" }
      };
    }

    setRecommendation(rec);
  }, [dataVolume, dashboards]);

  if (!recommendation) return null;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-secondary selection:text-secondary-foreground">
      {/* Hero Section */}
      <section className="relative w-full py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Data Warehouse Architecture" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="inline-flex items-center rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-secondary mr-2 animate-pulse"></span>
              Full Technical Analysis
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              Fabric F64 <span className="text-secondary">vs</span> The World
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Comparing Microsoft Fabric F64 against Azure Dedicated SQL Pool (DWU1000c) and Azure Databricks.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                View Analysis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-white">
                Sizing Guide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Equivalence Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                The Verdict: <span className="text-secondary">Technical Equivalence</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                <strong>Fabric F64</strong> is the modern capacity equivalent to <strong>DWU1000c</strong> for SQL warehousing and maps to a <strong>Medium (24 DBU)</strong> Databricks SQL Warehouse.
              </p>
              
              <div className="grid gap-4 mt-8">
                <Card className="glass-card border-l-4 border-l-secondary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-secondary flex items-center gap-2">
                      <Zap className="h-5 w-5" /> Microsoft Fabric
                    </CardTitle>
                    <CardDescription>Capacity F64</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Capacity Units</p>
                        <p className="font-mono font-bold text-white">64 CUs</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Spark vCores</p>
                        <p className="font-mono font-bold text-white">128 (Base) - 384 (Burst)</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Scaling</p>
                        <p className="font-mono font-bold text-white">Bursting (3x)</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Est. Cost</p>
                        <p className="font-mono font-bold text-white">~$8,409/mo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-center -my-6 z-10">
                  <div className="bg-background border border-white/10 rounded-full p-2 shadow-xl">
                    <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 lg:rotate-0" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="glass-card border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-blue-400 flex items-center gap-2 text-sm">
                        <Database className="h-4 w-4" /> Azure SQL Pool
                      </CardTitle>
                      <CardDescription>DWU1000c</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Equivalence</p>
                        <p className="font-mono font-bold text-white">Direct Match</p>
                        <p className="text-xs text-muted-foreground mt-1">For SQL Warehousing</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card border-l-4 border-l-orange-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-orange-400 flex items-center gap-2 text-sm">
                        <Server className="h-4 w-4" /> Azure Databricks
                      </CardTitle>
                      <CardDescription>Medium (24 DBUs)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Equivalence</p>
                        <p className="font-mono font-bold text-white">Medium Warehouse</p>
                        <p className="text-xs text-muted-foreground mt-1">For SQL Workloads</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-secondary rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative rounded-lg overflow-hidden border border-white/10 bg-background/50 shadow-2xl">
                <img 
                  src="/comparison-graphic.png" 
                  alt="Compute Nodes vs Capacity Units" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-6">
                  <p className="text-sm font-mono text-secondary">FIG 1.0: ARCHITECTURAL DIVERGENCE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Specs Table */}
      <section className="w-full py-12 md:py-24 bg-black/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">Comprehensive Specifications</h2>
            <p className="max-w-[900px] text-muted-foreground">
              A detailed side-by-side comparison of technical metrics across all three platforms.
            </p>
          </div>

          <Card className="glass-card overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="w-[200px] text-white font-bold">Feature</TableHead>
                  <TableHead className="text-secondary font-bold">Microsoft Fabric (F64)</TableHead>
                  <TableHead className="text-blue-400 font-bold">Azure SQL Pool (DWU1000c)</TableHead>
                  <TableHead className="text-orange-400 font-bold">Azure Databricks (Medium)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-white/5 border-white/10">
                  <TableCell className="font-medium text-muted-foreground">Primary Unit</TableCell>
                  <TableCell className="font-mono text-sm">64 Capacity Units (CU)</TableCell>
                  <TableCell className="font-mono text-sm">1000 DWU</TableCell>
                  <TableCell className="font-mono text-sm">24 DBUs (Medium)</TableCell>
                </TableRow>
                <TableRow className="hover:bg-white/5 border-white/10">
                  <TableCell className="font-medium text-muted-foreground">Compute Cores</TableCell>
                  <TableCell className="font-mono text-sm">128 (Base) - 384 (Burst) vCores</TableCell>
                  <TableCell className="font-mono text-sm">2 Compute Nodes</TableCell>
                  <TableCell className="font-mono text-sm">Abstracted (Autoscaling)</TableCell>
                </TableRow>
                <TableRow className="hover:bg-white/5 border-white/10">
                  <TableCell className="font-medium text-muted-foreground">Memory</TableCell>
                  <TableCell className="font-mono text-sm">Unified Pool</TableCell>
                  <TableCell className="font-mono text-sm">600 GB Total</TableCell>
                  <TableCell className="font-mono text-sm">Abstracted</TableCell>
                </TableRow>
                <TableRow className="hover:bg-white/5 border-white/10">
                  <TableCell className="font-medium text-muted-foreground">Concurrency</TableCell>
                  <TableCell className="font-mono text-sm">Dynamic (Bursting)</TableCell>
                  <TableCell className="font-mono text-sm">128 Slots (Static)</TableCell>
                  <TableCell className="font-mono text-sm">10 Queries/Cluster (Scaling)</TableCell>
                </TableRow>
                <TableRow className="hover:bg-white/5 border-white/10">
                  <TableCell className="font-medium text-muted-foreground">Scaling Logic</TableCell>
                  <TableCell className="font-mono text-sm">Bursting (3x)</TableCell>
                  <TableCell className="font-mono text-sm">Manual Scaling</TableCell>
                  <TableCell className="font-mono text-sm">Multi-Cluster Autoscaling</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>
      </section>

      {/* Sizing Recommendation Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/dashboard-concurrency.png" 
            alt="Dashboard Concurrency" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Badge variant="outline" className="border-secondary text-secondary mb-2">Sizing Scenario</Badge>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              {dataVolume}TB Database + {dashboards} Dashboards
            </h2>
            <p className="max-w-[800px] text-muted-foreground text-lg">
              Recommendation for a mid-sized enterprise workload with high concurrency requirements.
            </p>

            {/* Dynamic Inputs */}
            <div className="w-full max-w-md mt-8 p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-white/10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-white">Data Volume (TB)</Label>
                    <span className="text-secondary font-mono">{dataVolume} TB</span>
                  </div>
                  <Slider 
                    value={[dataVolume]} 
                    min={0.5} 
                    max={20} 
                    step={0.5} 
                    onValueChange={(vals) => setDataVolume(vals[0])}
                    className="py-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-white">Concurrent Dashboards</Label>
                    <span className="text-secondary font-mono">{dashboards}</span>
                  </div>
                  <Slider 
                    value={[dashboards]} 
                    min={10} 
                    max={200} 
                    step={10} 
                    onValueChange={(vals) => setDashboards(vals[0])}
                    className="py-2"
                  />
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="mt-4 border-secondary/50 text-secondary hover:bg-secondary/10"
              onClick={() => exportToPdf('sizing-scenario', 'sizing-recommendation.pdf')}
            >
              <Download className="mr-2 h-4 w-4" /> Export to PDF
            </Button>
          </div>

          <div id="sizing-scenario" className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto p-4 rounded-xl bg-background/50 backdrop-blur-sm">
            {/* Option 1: Minimum Viable */}
            <SizingCard 
              title="Minimum Viable"
              fabricSku={`${recommendation.min.fabric} / ${recommendation.min.dwu}`}
              databricksSku={recommendation.min.dbu}
              description="Cost-effective, but risky for concurrency"
              pros={[
                { icon: Info, text: `May struggle with ${dashboards} concurrent refreshes`, color: "text-yellow-500" },
                { icon: CheckCircle2, text: `Sufficient for ${dataVolume}TB storage`, color: "text-green-500" },
                { icon: Info, text: "Databricks: Heavy queuing likely", color: "text-orange-400" }
              ]}
              details={{
                fabric: `${recommendation.min.fabric} offers limited vCores. With ${dashboards} concurrent queries, each query gets minimal resources, likely causing queuing or slow performance during peak refreshes.`,
                synapse: `${recommendation.min.dwu} has limited concurrency slots. ${dashboards} dashboards will immediately trigger queuing.`,
                databricks: `${recommendation.min.dbu} supports limited concurrent queries per cluster. To handle ${dashboards}, it would need to scale significantly, which might be slower to spin up than desired.`
              }}
            />

            {/* Option 2: Recommended (Hero) */}
            <SizingCard 
              title="Balanced Choice"
              fabricSku={`${recommendation.rec.fabric} / ${recommendation.rec.dwu}`}
              databricksSku={recommendation.rec.dbu}
              description="Optimal balance of cost & performance"
              isRecommended={true}
              pros={[
                { icon: CheckCircle2, text: `Handles ${dashboards}+ Dashboards via bursting`, color: "text-secondary" },
                { icon: CheckCircle2, text: `${dataVolume}TB Data fits comfortably in memory`, color: "text-secondary" },
                { icon: CheckCircle2, text: "Databricks: Scales to 2-3 clusters", color: "text-orange-400" }
              ]}
              details={{
                fabric: `${recommendation.rec.fabric} can burst to handle spikes. This 'smoothing' allows it to absorb the spike of ${dashboards} simultaneous queries without immediate queuing.`,
                synapse: `${recommendation.rec.dwu} supports sufficient concurrent queries. While ${dashboards} dashboards might exceed this, the queue clears fast enough for acceptable UX.`,
                databricks: `${recommendation.rec.dbu} handles ~20 queries/cluster. For ${dashboards} queries, it autoscales to 2-3 clusters. Serverless startup is fast enough to prevent timeouts.`
              }}
            />

            {/* Option 3: Performance */}
            <SizingCard 
              title="High Performance"
              fabricSku={`${recommendation.perf.fabric} / ${recommendation.perf.dwu}`}
              databricksSku={recommendation.perf.dbu}
              description="Maximum speed & headroom"
              pros={[
                { icon: CheckCircle2, text: "Zero latency for concurrent users", color: "text-green-500" },
                { icon: CheckCircle2, text: "Future-proof for data growth", color: "text-green-500" },
                { icon: CheckCircle2, text: "Databricks: Higher concurrency/node", color: "text-orange-400" }
              ]}
              details={{
                fabric: `${recommendation.perf.fabric} provides massive parallelism. ${dashboards} queries run almost instantly in parallel. Overkill unless sub-second latency is required.`,
                synapse: `${recommendation.perf.dwu} increases concurrency slots significantly. Good if you expect the ${dashboards} dashboards to grow soon.`,
                databricks: `${recommendation.perf.dbu} handles more queries per cluster due to larger memory. Might handle ${dashboards} queries with fewer clusters, reducing cold-start variance.`
              }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-black/40 border-t border-white/5">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 Technical Comparison. Based on Microsoft Fabric Blog & Azure Documentation.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BarChart3 className="h-3 w-3" /> Data sourced from official benchmarks
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
