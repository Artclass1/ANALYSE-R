import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FinancialReport {
  title: string;
  summary: string;
  sections: {
    title: string;
    content: string;
    perspective: "History" | "Present" | "Future";
    insights: string[];
  }[];
  quantitativeData: {
    chartTitle: string;
    chartData: { period: string; value: number }[];
    tableTitle: string;
    tableData: {
      headers: string[];
      rows: string[][];
    };
  };
  strategicInsights: string[];
  socialImpactAnalysis: string;
  marketOutlook: {
    sentiment: string;
    keyDrivers: string[];
    riskFactors: string[];
  };
}

export const generateFinancialReport = async (prompt: string): Promise<FinancialReport> => {
  const systemInstruction = `
    You are an elite financial analyst and strategic consultant. 
    Your task is to generate an advanced, minimal financial report STRICTLY based on the user's prompt.
    
    USER PROMPT / TOPIC: "${prompt}"
    
    The report must cover:
    1. History, Present, and Future perspectives for businesses, jobs, stocks, market, and sectors related to the prompt.
    2. AI era economics, global politics, weather, human tendency, and psychology.
    3. Social impact analysis.
    4. Actionable strategic insights.
    5. Quantitative Data: Provide realistic or highly educated estimated metrics for a chart (e.g., market growth, adoption rates, valuation over time) and a structured data table (e.g., sector comparisons, financial projections, or historical data points).

    Style: Professional, minimal, analytical, and forward-thinking.
    Avoid fluff. Focus on deep, non-obvious perspectives.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate a highly comprehensive, in-depth financial and strategic analysis report for: ${prompt}`,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                perspective: { type: Type.STRING, description: "Must be exactly one of: History, Present, Future" },
                insights: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "content", "perspective", "insights"]
            }
          },
          quantitativeData: {
            type: Type.OBJECT,
            properties: {
              chartTitle: { type: Type.STRING },
              chartData: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    period: { type: Type.STRING },
                    value: { type: Type.NUMBER }
                  },
                  required: ["period", "value"]
                }
              },
              tableTitle: { type: Type.STRING },
              tableData: {
                type: Type.OBJECT,
                properties: {
                  headers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rows: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  }
                },
                required: ["headers", "rows"]
              }
            },
            required: ["chartTitle", "chartData", "tableTitle", "tableData"]
          },
          strategicInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
          socialImpactAnalysis: { type: Type.STRING },
          marketOutlook: {
            type: Type.OBJECT,
            properties: {
              sentiment: { type: Type.STRING },
              keyDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
              riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["sentiment", "keyDrivers", "riskFactors"]
          }
        },
        required: ["title", "summary", "sections", "quantitativeData", "strategicInsights", "socialImpactAnalysis", "marketOutlook"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response text received from the model.");
  }

  return JSON.parse(response.text);
};
