"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Map, Target, Briefcase, Loader2, CheckCircle2, AlertOctagon, Sparkles, TerminalSquare } from "lucide-react";

export default function CareerSkillGapAnalyzer() {
  const [targetRole, setTargetRole] = useState("");
  const [currentBackground, setCurrentBackground] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  const handleGenerate = async () => {
    if (!targetRole.trim() || !currentBackground.trim()) return;
    setIsGenerating(true);
    setRoadmap(null);

    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, currentBackground }),
      });

      if (!response.ok) throw new Error("Failed to generate roadmap");
      
      const data = await response.json();
      setRoadmap(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while building your advanced roadmap.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto mt-16 pt-10 border-t border-zinc-200">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold flex items-center justify-center gap-3 tracking-tight text-zinc-900">
          <Map className="text-indigo-600 w-8 h-8" />
          Advanced Skill Matrix & Roadmap
        </h2>
        <p className="text-zinc-500 text-sm mt-2 max-w-xl mx-auto">
          We analyze your actual experience against industry demands to calculate your match score and build a project-driven learning path.
        </p>
      </div>

      {/* Heavy Input Section */}
      <div className="bg-white p-6 border border-zinc-200 rounded-2xl shadow-sm mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">1. Your Current State</label>
            <textarea
              className="w-full h-32 p-4 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-zinc-700 resize-none bg-zinc-50"
              placeholder="Paste your resume summary, or list your current skills (e.g., '3 years React, basic Node.js, know SQL but not perfectly...')"
              value={currentBackground}
              onChange={(e) => setCurrentBackground(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">2. Your Target Destination</label>
            <div className="relative flex-grow">
              <Target className="absolute left-4 top-4 text-zinc-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-zinc-800 bg-zinc-50"
                placeholder="e.g., Senior Machine Learning Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !targetRole || !currentBackground}
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          {isGenerating ? <><Loader2 className="animate-spin w-5 h-5" /> Processing Matrix & Analyzing Gaps...</> : "Run Advanced Gap Analysis"}
        </button>
      </div>

      {/* Results Section */}
      {roadmap && (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Top Metric Header */}
          <div className="bg-zinc-950 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl text-white">
            <div className="max-w-xl">
              <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
                <Target className="text-indigo-400" /> Target: {targetRole}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{roadmap.roleOverview}</p>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-zinc-900 border border-zinc-800 rounded-full w-40 h-40 shrink-0 relative">
              <span className="text-4xl font-black text-white">{roadmap.matchScore}%</span>
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">Match Score</span>
              {/* Fake SVG Ring for cool factor */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#27272a" strokeWidth="4" />
                <circle cx="50" cy="50" r="48" fill="none" stroke="#4f46e5" strokeWidth="4" strokeDasharray={`${roadmap.matchScore * 3}, 300`} strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Tri-State Skill Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <h4 className="text-emerald-800 font-bold flex items-center gap-2 mb-4"><CheckCircle2 className="w-5 h-5" /> Verified Skills</h4>
              <div className="flex flex-wrap gap-2">
                {roadmap.possessedSkills.map((s: string) => <span key={s} className="px-3 py-1 bg-white text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">{s}</span>)}
              </div>
            </div>
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl">
              <h4 className="text-rose-800 font-bold flex items-center gap-2 mb-4"><AlertOctagon className="w-5 h-5" /> Critical Missing</h4>
              <div className="flex flex-wrap gap-2">
                {roadmap.missingCriticalSkills.map((s: string) => <span key={s} className="px-3 py-1 bg-white text-rose-700 border border-rose-200 rounded-lg text-xs font-bold">{s}</span>)}
              </div>
            </div>
            <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl">
              <h4 className="text-amber-800 font-bold flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5" /> Bonus Differentiators</h4>
              <div className="flex flex-wrap gap-2">
                {roadmap.missingBonusSkills.map((s: string) => <span key={s} className="px-3 py-1 bg-white text-amber-700 border border-amber-200 rounded-lg text-xs font-bold">{s}</span>)}
              </div>
            </div>
          </div>
{/* Project-Driven Timeline */}
<div className="mt-4">
  <h3 className="text-xl font-bold text-zinc-900 mb-12 flex items-center gap-2">
    <Briefcase className="text-indigo-600" /> Your Execution Plan
  </h3>

  <div className="relative">

    {/* vertical line */}
    <div className="absolute left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500 h-full opacity-30"></div>

    <div className="flex flex-col gap-20">

      {roadmap.timeline.map((phase: any, i: number) => {

        const isLeft = i % 2 === 0

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`relative flex items-center w-full ${
              isLeft ? "justify-start" : "justify-end"
            }`}
          >

            {/* glowing timeline node */}
            <div className="absolute left-1/2 -translate-x-1/2 z-10">
              <div className="w-6 h-6 bg-indigo-600 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
            </div>

            {/* card */}
            <div
              className={`w-full md:w-[45%] bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all ${
                isLeft ? "mr-auto pr-8" : "ml-auto pl-8"
              }`}
            >
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1 block">
                {phase.phase}
              </span>

              <h4 className="font-bold text-zinc-900 mb-4">
                {phase.focus}
              </h4>

              <ul className="space-y-3 mb-6">
                {phase.milestones.map((m: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-sm text-zinc-600 flex items-start gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 shrink-0"></div>
                    {m}
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-zinc-100">
                <p className="text-xs font-bold text-zinc-400 uppercase mb-2 flex items-center gap-1">
                  <TerminalSquare className="w-3 h-3" /> Portfolio Project
                </p>

                <p className="text-sm font-semibold text-zinc-800">
                  {phase.portfolioProject}
                </p>
              </div>

            </div>

          </motion.div>
        )
      })}

    </div>

  </div>
</div>
        </div>
      )}
    </div>
  );
}