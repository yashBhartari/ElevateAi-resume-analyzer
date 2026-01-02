
export interface Correction {
  issue: string;
  impact: 'High' | 'Medium' | 'Low';
  fix: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  formattingScore: number;
  keywordMatchScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  missingKeywords: string[];
  jobTitleMatch: string;
  summary: string;
  detailedCorrections: Correction[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
}

export type Theme = 'light' | 'dark';

export interface AnalysisState {
  isAnalyzing: boolean;
  result: ResumeAnalysis | null;
  error: string | null;
}
