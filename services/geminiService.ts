
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeAnalysis } from "../types";

export const analyzeResume = async (
  resumeText: string,
  jobDescription?: string,
  customFocus?: string
): Promise<ResumeAnalysis> => {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Use gemini-2.5-flash for resume analysis to utilize free tier with higher limits
      const model = 'gemini-2.5-flash';

      const prompt = `
        Perform a high-speed professional audit of this resume.
        Act as an efficient Technical Recruiter and ATS algorithm.

        RESUME CONTENT:
        ${resumeText}

        ${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}` : 'No target job description provided.'}

        ${customFocus ? `USER SPECIFIC FOCUS / QUESTION:\n${customFocus}` : ''}

        YOUR TASKS:
        1. Calculate an ATS Score (0-100).
        2. Identify specific issues ("What's Wrong").
        3. Provide actionable fixes ("The Fix").
        4. List missing industry-standard keywords.
        5. Summarize marketability.
        ${customFocus ? `6. Address: "${customFocus}"` : ''}

        Return in strictly structured JSON.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: "You are an expert ATS optimizer. Provide fast, accurate, and actionable resume feedback in JSON format.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              atsScore: { type: Type.NUMBER },
              formattingScore: { type: Type.NUMBER },
              keywordMatchScore: { type: Type.NUMBER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              jobTitleMatch: { type: Type.STRING },
              summary: { type: Type.STRING },
              detailedCorrections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    issue: { type: Type.STRING },
                    impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                    fix: { type: Type.STRING }
                  },
                  required: ["issue", "impact", "fix"]
                }
              }
            },
            required: ["atsScore", "formattingScore", "keywordMatchScore", "strengths", "weaknesses", "suggestions", "missingKeywords", "jobTitleMatch", "summary", "detailedCorrections"]
          },
          // Optional: limit thinking budget if latency is a concern
          thinkingConfig: { thinkingBudget: 0 },
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (!text) throw new Error("No response received from AI");

      return JSON.parse(text) as ResumeAnalysis;
    } catch (error: any) {
      lastError = error;

      // Check if it's a quota exceeded error
      if (error?.status === 429 || error?.code === 429 || error?.message?.includes('quota')) {
        if (attempt < maxRetries - 1) {
          // Wait with exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }

      // For non-quota errors or if max retries reached, throw immediately
      throw error;
    }
  }

  // If we get here, all retries failed
  throw lastError || new Error("Failed to analyze resume after retries");
};
