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
  ShieldAlert,
  Database
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { generateFinancialReport, FinancialReport } from "./services/PerspectiveService";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<FinancialReport | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a topic to generate a report.");
      return;
    }
    setIsLoading(true);
    setReport(null);
    try {
      const data = await generateFinancialReport(prompt);
      setReport(data);
      setLastPrompt(prompt);
      toast.success("Report generated successfully!");
    } catch (error) {
      console.error("Failed to generate report:", error);
      toast.error("Failed to generate report. Please try again or use a different prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    try {
      toast.info("Preparing PDF for download...");
      
      const dataUrl = await toPng(reportRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#000000",
        style: {
          width: '1000px',
          maxWidth: '1000px',
          padding: '40px'
        },
        onclone: (document, element) => {
          const pdfOnly = element.querySelectorAll('.pdf-only');
          pdfOnly.forEach(el => el.classList.remove('hidden'));
        }
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(dataUrl);
      const totalImgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = totalImgHeight;
      let position = 0;

      pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, totalImgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - totalImgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, totalImgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`Perspective_Report_${report?.title.replace(/\s+/g, "_") || "Export"}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[#ffffff] selection:text-[#000000] pb-20">
      <Toaster theme="dark" position="top-center" />

      <header className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-[#ffffff1a] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#ffffff] flex items-center justify-center">
            <Brain className="w-4 h-4 text-[#000000]" />
          </div>
          <span className="text-lg font-mono font-bold tracking-tight uppercase">PERSPECTIVE // INTELLIGENCE TERMINAL</span>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-mono border-[#ffffff33] rounded-none">SYS: ONLINE</Badge>
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
                <h1 className="text-4xl md:text-6xl font-mono font-bold tracking-tighter uppercase">
                  QUERY ENGINE
                </h1>
                <p className="text-muted-foreground font-mono text-sm max-w-xl mx-auto">
                  Enter parameters for strategic synthesis. System will analyze historical data, present conditions, and future trajectories.
                </p>
              </div>

              <div className="relative group max-w-2xl mx-auto">
                <div className="relative flex items-center bg-[#000000] border border-[#ffffff33] p-1">
                  <span className="font-mono text-muted-foreground pl-4 pr-2">{">"}</span>
                  <Input 
                    placeholder="Enter sector, market, or business topic..." 
                    className="border-none bg-[#00000000] focus-visible:ring-0 font-mono text-sm h-12 rounded-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  />
                  <Button 
                    onClick={handleGenerate}
                    className="h-12 px-6 rounded-none bg-[#ffffff] text-[#000000] hover:bg-[#ffffffE6] transition-all font-mono text-xs uppercase font-bold"
                  >
                    Execute
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto">
                {[
                  { icon: TrendingUp, label: "Market Trends" },
                  { icon: Globe, label: "Global Politics" },
                  { icon: Users, label: "Human Tendency" },
                  { icon: CloudRain, label: "Climate Impact" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 border border-[#ffffff1a] bg-[#000000]">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] uppercase tracking-widest font-mono opacity-50">{item.label}</span>
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
                <Loader2 className="w-12 h-12 animate-spin text-[#ffffff80]" />
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-mono font-bold tracking-tight uppercase">Synthesizing Data</h2>
                  <p className="text-muted-foreground font-mono text-xs animate-pulse">Running analysis on history, psychology, and future trajectories...</p>
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4 bg-[#ffffff0d]" />
                <Skeleton className="h-4 w-full bg-[#ffffff0d]" />
                <Skeleton className="h-4 w-5/6 bg-[#ffffff0d]" />
                <div className="grid grid-cols-3 gap-4 pt-8">
                  <Skeleton className="h-40 bg-[#ffffff0d]" />
                  <Skeleton className="h-40 bg-[#ffffff0d]" />
                  <Skeleton className="h-40 bg-[#ffffff0d]" />
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#ffffff33] pb-6 mb-8">
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-[#ffffff1a] text-[#ffffff] border-none uppercase tracking-widest font-mono text-[10px] rounded-none">Verified Intelligence</Badge>
                  <h1 className="text-4xl font-bold tracking-tight uppercase leading-none">{report.title}</h1>
                  <p className="text-muted-foreground font-mono text-sm max-w-2xl">{report.summary}</p>
                </div>
                <div className="flex flex-col items-end gap-4 mt-6 md:mt-0">
                  <div className="text-right font-mono text-[10px] text-muted-foreground flex flex-col gap-1">
                    <span>ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                    <span>SYS: GEMINI-3-FLASH</span>
                    <span>TIMESTAMP: {new Date().toISOString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setReport(null)} className="border-[#ffffff33] rounded-none hover:bg-[#ffffff1a] font-mono text-xs uppercase">
                      Reset
                    </Button>
                    <Button onClick={downloadPDF} className="bg-[#ffffff] text-[#000000] rounded-none hover:bg-[#ffffffE6] font-mono text-xs uppercase">
                      <Download className="w-3 h-3 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </div>

              <div ref={reportRef} className="bg-[#000000] p-8 border border-[#ffffff33] space-y-12">
                {/* PDF Header (Hidden on screen, visible in PDF) */}
                <div className="hidden pdf-only flex-col mb-12 border-b border-[#ffffff33] pb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-mono font-bold tracking-tight uppercase">PERSPECTIVE // TERMINAL</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">Confidential Strategic Intelligence</span>
                  </div>
                  <div className="mt-4 text-[10px] font-mono uppercase text-muted-foreground">
                    QUERY: {lastPrompt}
                  </div>
                </div>

                <Tabs defaultValue="History" className="w-full">
                  <TabsList className="bg-[#00000000] border-b border-[#ffffff33] p-0 mb-8 w-full justify-start rounded-none h-auto">
                    <TabsTrigger value="History" className="rounded-none border-b-2 border-[#00000000] data-[state=active]:border-[#ffffff] data-[state=active]:bg-[#00000000] data-[state=active]:text-[#ffffff] font-mono text-xs uppercase py-3 px-6">
                      [ History ]
                    </TabsTrigger>
                    <TabsTrigger value="Present" className="rounded-none border-b-2 border-[#00000000] data-[state=active]:border-[#ffffff] data-[state=active]:bg-[#00000000] data-[state=active]:text-[#ffffff] font-mono text-xs uppercase py-3 px-6">
                      [ Present ]
                    </TabsTrigger>
                    <TabsTrigger value="Future" className="rounded-none border-b-2 border-[#00000000] data-[state=active]:border-[#ffffff] data-[state=active]:bg-[#00000000] data-[state=active]:text-[#ffffff] font-mono text-xs uppercase py-3 px-6">
                      [ Future ]
                    </TabsTrigger>
                  </TabsList>
                  
                  {["History", "Present", "Future"].map((p) => (
                    <TabsContent key={p} value={p} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-12">
                        {report.sections.filter(s => s.perspective === p).map((section, i) => (
                          <div key={i} className="space-y-4">
                            <h3 className="text-2xl font-bold tracking-tight border-l-2 border-[#ffffff] pl-4">{section.title}</h3>
                            <p className="text-muted-foreground leading-relaxed font-light">{section.content}</p>
                            <div className="space-y-2 pt-4">
                              <span className="text-[10px] uppercase tracking-widest font-mono font-bold opacity-50">Key Insights</span>
                              <ul className="space-y-2 mt-2">
                                {section.insights.map((insight, j) => (
                                  <li key={j} className="flex items-start gap-2 text-sm font-mono">
                                    <span className="text-[#ffffff80] shrink-0">{">"}</span>
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

                <Separator className="bg-[#ffffff33]" />

                {/* Quantitative Data Section */}
                {report.quantitativeData && (
                  <div className="space-y-12">
                    <div className="flex items-center gap-3 border-b border-[#ffffff1a] pb-4">
                      <Database className="w-5 h-5" />
                      <h2 className="text-xl font-mono font-bold tracking-tight uppercase">Quantitative Analysis</h2>
                    </div>
                    
                    <div className="grid lg:grid-cols-2 gap-12">
                      {/* Chart */}
                      <div className="space-y-6">
                        <h3 className="text-sm font-mono uppercase tracking-widest opacity-70">{report.quantitativeData.chartTitle}</h3>
                        <div className="h-[300px] w-full border border-[#ffffff1a] p-4 bg-[#ffffff05]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={report.quantitativeData.chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
                              <XAxis 
                                dataKey="period" 
                                stroke="#ffffff50" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                fontFamily="monospace"
                              />
                              <YAxis 
                                stroke="#ffffff50" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                fontFamily="monospace"
                                tickFormatter={(value) => String(value)}
                              />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: '12px' }}
                                itemStyle={{ color: '#fff' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#ffffff" 
                                strokeWidth={2} 
                                dot={{ r: 4, fill: "#000", stroke: "#fff", strokeWidth: 2 }} 
                                activeDot={{ r: 6 }} 
                                isAnimationActive={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Data Table */}
                      <div className="space-y-6">
                        <h3 className="text-sm font-mono uppercase tracking-widest opacity-70">{report.quantitativeData.tableTitle}</h3>
                        <div className="overflow-x-auto border border-[#ffffff1a] bg-[#ffffff05]">
                          <table className="w-full text-left font-mono text-xs">
                            <thead className="bg-[#ffffff0d] border-b border-[#ffffff1a]">
                              <tr>
                                {report.quantitativeData.tableData.headers.map((header, i) => (
                                  <th key={i} className="p-3 font-bold uppercase tracking-wider">{header}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {report.quantitativeData.tableData.rows.map((row, i) => (
                                <tr key={i} className="border-b border-[#ffffff0d] last:border-0 hover:bg-[#ffffff0d] transition-colors">
                                  {row.map((cell, j) => (
                                    <td key={j} className="p-3 opacity-80">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Separator className="bg-[#ffffff33]" />

                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="bg-[#000000] border-[#ffffff33] rounded-none">
                    <CardHeader className="border-b border-[#ffffff1a] pb-4">
                      <CardTitle className="text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Market Outlook
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase opacity-50">Sentiment</span>
                        <p className="font-mono text-sm mt-1 text-[#ffffff]">{report.marketOutlook.sentiment}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase opacity-50">Key Drivers</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {report.marketOutlook.keyDrivers.map((d, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] font-mono border-[#ffffff33] rounded-none">{d}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#000000] border-[#ffffff33] rounded-none">
                    <CardHeader className="border-b border-[#ffffff1a] pb-4">
                      <CardTitle className="text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> Risk Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2">
                        {report.marketOutlook.riskFactors.map((r, i) => (
                          <li key={i} className="text-xs font-mono flex items-start gap-2">
                            <span className="text-[#ef4444] shrink-0">!</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#000000] border-[#ffffff33] rounded-none">
                    <CardHeader className="border-b border-[#ffffff1a] pb-4">
                      <CardTitle className="text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-4 h-4" /> Social Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                        {report.socialImpactAnalysis}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6 pt-8 border-t border-[#ffffff33]">
                  <h2 className="text-xl font-mono font-bold tracking-tight uppercase">Strategic Action Plan</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {report.strategicInsights.map((insight, i) => (
                      <div key={i} className="p-4 border border-[#ffffff33] bg-[#000000] flex gap-4 items-start">
                        <div className="font-mono text-xs text-muted-foreground shrink-0 mt-0.5">
                          [{String(i + 1).padStart(2, '0')}]
                        </div>
                        <p className="text-sm font-mono leading-tight">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 w-full bg-[#000000] border-t border-[#ffffff33] py-3 z-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>&copy; 2026 PERSPECTIVE TERMINAL</span>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            <span className="text-[#ffffff]">DEALS & UPDATES: artclassstudio11@gmail.com</span>
            <span className="opacity-50 hidden md:inline">|</span>
            <span className="text-[#22c55e]">SYS: OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
