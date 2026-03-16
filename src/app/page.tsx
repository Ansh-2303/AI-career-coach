"use client";

import DashboardLayout from "@/components/DashboardLayout";

import VideoUploader from "@/components/shared/VideoUploader";
import CareerAdvisor from "@/components/shared/CareerAdvisor";
import CareerSkillGapAnalyzer from "@/components/shared/CareerSkillGapAnalyzer";
import ResumeEnhancer from "@/components/shared/ResumeEnhancer";
import ResumeStudio from "@/components/resume/ResumeStudio"
import CoverLetterGenerator from "@/components/shared/CoverLetterGenerator";
import MockInterview from "@/components/shared/MockInterview";
import IndustryInsights from "@/components/shared/IndustryInsights";
import InterviewCoachHub from "@/components/interview/InterviewCoachHub";
import CareerStrategyHub from "@/components/career/CareerStrategyHub";
import OverviewDashboard from "@/components/dashboard/OverviewDashboard";


export default function Home() {
  return (
    <DashboardLayout
    overview={
  <OverviewDashboard />
}

      resume={
        <div className="space-y-10">
     <ResumeStudio />
        </div>
      }

      interview={
        <div className="space-y-10">
       <InterviewCoachHub />
        </div>
      }

      career={
        <div className="space-y-10">
        <CareerStrategyHub />
        </div>
      }
    />
  );
}