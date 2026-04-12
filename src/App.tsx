import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Download, 
  TrendingUp, 
  History, 
  Zap, 
  Globe, 
  Users, 
  Brain, 
  CloudRain,
  ArrowRight,
  Loader2,
  FileText,
  BarChart3,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { generateFinancialReport, FinancialReport } from "./services/PerspectiveService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<FinancialReport | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setReport(null);
    try {
      const data = await generateFinancialReport(prompt);
      setReport(data);
    } catch (error) {
      console.error("Failed to generate report:", error);
      alert("Failed to generate report. Please try again or use a different prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0a0a0a",
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Perspective_Report_${report?.title.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-white selection:text-black pb-20">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
      </div>

      <header className="container mx-auto px-6 py-8 flex justify-between items-center border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <Brain className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase">Perspective AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-white/20">Strategic Intelligence v1.0</Badge>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-20 relative z-10">
        <AnimatePresence mode="wait">
          {!report && !isLoading ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto text-center space-y-12"
            >
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-gradient">
                  THE FUTURE <br /> OF STRATEGY
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light">
                  Advanced minimal financial intelligence providing deep perspectives across time, psychology, and global dynamics.
                </p>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/5 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-card border border-white/10 rounded-xl p-2">
                  <Search className="w-5 h-5 ml-4 text-muted-foreground" />
                  <Input 
                    placeholder="Enter a sector, market, or business topic..." 
                    className="border-none bg-transparent focus-visible:ring-0 text-lg h-14"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  />
                  <Button 
                    onClick={handleGenerate}
                    className="h-14 px-8 rounded-lg bg-white text-black hover:bg-white/90 transition-all font-semibold"
                  >
                    Generate Report
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
                {[
                  { icon: TrendingUp, label: "Market Trends" },
                  { icon: Globe, label: "Global Politics" },
                  { icon: Users, label: "Human Tendency" },
                  { icon: CloudRain, label: "Climate Impact" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-[10px] uppercase tracking-widest font-medium opacity-50">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <Loader2 className="w-12 h-12 animate-spin text-white/50" />
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">Synthesizing Perspectives</h2>
                  <p className="text-muted-foreground animate-pulse">Analyzing history, psychology, and future trajectories...</p>
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4 bg-white/5" />
                <Skeleton className="h-4 w-full bg-white/5" />
                <Skeleton className="h-4 w-5/6 bg-white/5" />
                <div className="grid grid-cols-3 gap-4 pt-8">
                  <Skeleton className="h-40 bg-white/5" />
                  <Skeleton className="h-40 bg-white/5" />
                  <Skeleton className="h-40 bg-white/5" />
                </div>
              </div>
            </motion.div>
          ) : report && (
            <motion.div 
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto space-y-8"
            >
              <div className="flex justify-between items-end border-b border-white/10 pb-8">
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-white/10 text-white border-none uppercase tracking-tighter text-[10px]">Strategic Report</Badge>
                  <h1 className="text-5xl font-bold tracking-tighter uppercase leading-none">{report.title}</h1>
                  <p className="text-muted-foreground max-w-2xl font-light">{report.summary}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setReport(null)} className="border-white/10 hover:bg-white/5">
                    New Analysis
                  </Button>
                  <Button onClick={downloadPDF} className="bg-white text-black hover:bg-white/90">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>

              <div ref={reportRef} className="bg-background p-8 rounded-2xl border border-white/5 space-y-12">
                {/* PDF Header (Hidden on screen, visible in PDF) */}
                <div className="hidden pdf-only flex justify-between items-center mb-12 border-b border-white/10 pb-4">
                  <span className="text-xl font-bold tracking-tighter uppercase">Perspective AI</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-50">Confidential Strategic Intelligence</span>
                </div>

                <Tabs defaultValue="History" className="w-full">
                  <TabsList className="bg-white/5 border border-white/10 p-1 mb-8">
                    <TabsTrigger value="History" className="data-[state=active]:bg-white data-[state=active]:text-black flex gap-2">
                      <History className="w-4 h-4" /> History
                    </TabsTrigger>
                    <TabsTrigger value="Present" className="data-[state=active]:bg-white data-[state=active]:text-black flex gap-2">
                      <Zap className="w-4 h-4" /> Present
                    </TabsTrigger>
                    <TabsTrigger value="Future" className="data-[state=active]:bg-white data-[state=active]:text-black flex gap-2">
                      <TrendingUp className="w-4 h-4" /> Future
                    </TabsTrigger>
                  </TabsList>
                  
                  {["History", "Present", "Future"].map((p) => (
                    <TabsContent key={p} value={p} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-12">
                        {report.sections.filter(s => s.perspective === p).map((section, i) => (
                          <div key={i} className="space-y-4">
                            <h3 className="text-2xl font-bold tracking-tight border-l-2 border-white pl-4">{section.title}</h3>
                            <p className="text-muted-foreground leading-relaxed font-light">{section.content}</p>
                            <div className="space-y-2 pt-4">
                              <span className="text-[10px] uppercase tracking-widest font-bold opacity-30">Key Insights</span>
                              <ul className="space-y-2">
                                {section.insights.map((insight, j) => (
                                  <li key={j} className="flex items-start gap-2 text-sm">
                                    <ArrowRight className="w-4 h-4 mt-0.5 text-white/50 shrink-0" />
                                    <span>{insight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                <Separator className="bg-white/5" />

                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader>
                      <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Market Outlook
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-[10px] uppercase opacity-50">Sentiment</span>
                        <p className="font-bold text-lg">{report.marketOutlook.sentiment}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase opacity-50">Key Drivers</span>
                        <div className="flex flex-wrap gap-2">
                          {report.marketOutlook.keyDrivers.map((d, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] border-white/10">{d}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader>
                      <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> Risk Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {report.marketOutlook.riskFactors.map((r, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/[0.02] border-white/5">
                    <CardHeader>
                      <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-4 h-4" /> Social Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        "{report.socialImpactAnalysis}"
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6 pt-8">
                  <h2 className="text-3xl font-bold tracking-tighter uppercase">Strategic Action Plan</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {report.strategicInsights.map((insight, i) => (
                      <div key={i} className="p-6 rounded-xl border border-white/10 bg-white/5 flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm font-medium leading-tight">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 w-full bg-background/80 backdrop-blur-sm border-t border-white/5 py-4 z-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest opacity-60">
          <span>&copy; 2026 Perspective AI Intelligence</span>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            <span className="text-white font-bold">For Deals & Advanced Updates: artclassstudio11@gmail.com</span>
            <span className="opacity-50 hidden md:inline">|</span>
            <span className="opacity-50">API Status: Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
