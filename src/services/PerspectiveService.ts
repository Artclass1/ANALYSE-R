import { GoogleGenAI, Type } from "@google/genai";

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
    Your task is to generate an advanced, minimal financial report based on the user's prompt.
    The report must cover:
    1. History, Present, and Future perspectives for businesses, jobs, stocks, market, and sectors.
    2. AI era economics, global politics, weather, human tendency, and psychology.
    3. Social impact analysis.
    4. Actionable strategic insights.

    Style: Professional, minimal, analytical, and forward-thinking.
    Avoid fluff. Focus on deep, non-obvious perspectives.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a comprehensive financial report for: ${prompt}`,
    config: {
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
        required: ["title", "summary", "sections", "strategicInsights", "socialImpactAnalysis", "marketOutlook"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response text received from the model.");
  }

  return JSON.parse(response.text);
};
