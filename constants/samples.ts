
import { ResumeAnalysis } from '../types';

export const SAMPLE_REPORTS: Record<string, { title: string, analysis: ResumeAnalysis, resumeText: string, jobDescription: string }> = {
  software_engineer: {
    title: "Senior Software Engineer",
    resumeText: "John Doe\nSenior Software Engineer with 8 years of experience in Full Stack Development. Expert in React, Node.js, and AWS. Reduced latency by 40% at TechCorp.",
    jobDescription: "Looking for a Senior Full Stack Engineer proficient in React and cloud infrastructure. Must have experience leading teams and optimizing performance.",
    analysis: {
      atsScore: 88,
      formattingScore: 92,
      keywordMatchScore: 85,
      strengths: [
        "Strong quantifiable achievements (40% latency reduction)",
        "Clear technical stack alignment with target role",
        "Professional summary is punchy and relevant"
      ],
      weaknesses: [
        "Minor missing cloud-native keywords like 'Kubernetes'",
        "Education section is slightly buried",
        "Contact info format might be missed by older ATS"
      ],
      suggestions: [
        "Move AWS certifications to the top of the skills section.",
        "Include more details about team leadership size.",
        "Add 'Microservices' to your core competencies."
      ],
      missingKeywords: ["Kubernetes", "Docker", "Microservices", "CI/CD Pipeline", "Terraform"],
      jobTitleMatch: "Senior Full Stack Engineer",
      summary: "This is a high-quality resume. You have excellent metrics and clear technical depth. With a few keyword additions related to DevOps, this would be a near-perfect match for the target role.",
      detailedCorrections: [
        {
          issue: "Missing DevOps orchestration keywords despite AWS experience.",
          impact: "Medium",
          fix: "Add a sentence in the TechCorp section mentioning: 'Managed deployments using Docker and Kubernetes to orchestrate microservices.'"
        },
        {
          issue: "Soft skills are implied but not explicitly stated.",
          impact: "Low",
          fix: "In your summary, change 'Reduced latency' to 'Led a team of 5 to reduce latency...', highlighting leadership."
        }
      ]
    }
  },
  marketing_manager: {
    title: "Growth Marketing Lead",
    resumeText: "Jane Smith\nMarketing enthusiast. I love social media and building brands. Worked at several startups doing everything from SEO to events.",
    jobDescription: "Growth Marketing Lead needed to drive user acquisition. Experience with SQL, Facebook Ads Manager, and A/B testing required.",
    analysis: {
      atsScore: 45,
      formattingScore: 60,
      keywordMatchScore: 30,
      strengths: [
        "Broad experience across different marketing channels",
        "Startup background suggests adaptability"
      ],
      weaknesses: [
        "Extremely vague language ('everything from SEO to events')",
        "Zero quantifiable metrics or ROI mentions",
        "Missing critical technical marketing tools"
      ],
      suggestions: [
        "Replace 'Marketing enthusiast' with 'Data-driven Growth Marketer'.",
        "List specific growth percentages for each role.",
        "Mention SQL and Facebook Ads Manager explicitly."
      ],
      missingKeywords: ["User Acquisition", "LTV/CAC", "A/B Testing", "SQL", "Facebook Ads Manager", "Retention"],
      jobTitleMatch: "Growth Marketing Lead",
      summary: "Your resume is currently too 'soft'. Modern marketing roles are highly technical and data-focused. You need to prove your impact with numbers rather than just listing responsibilities.",
      detailedCorrections: [
        {
          issue: "Lack of data-backed achievements.",
          impact: "High",
          fix: "Instead of 'Managed social media', use: 'Increased Instagram engagement by 25% and drove 10k monthly referrals through organic content strategy.'"
        },
        {
          issue: "Weak opening summary.",
          impact: "High",
          fix: "Rewrite as: 'Growth Marketer with 4+ years of experience scaling startups. Expert in paid acquisition, funnel optimization, and data analytics (SQL/Tableau).'"
        }
      ]
    }
  }
};
