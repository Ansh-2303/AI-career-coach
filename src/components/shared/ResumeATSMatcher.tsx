"use client";

import { useState } from "react";
import { FileText, Briefcase, Loader2, CheckCircle2, AlertOctagon, Copy, Sparkles, Target, ArrowRight } from "lucide-react";

export default function ResumeATSMatcher() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/ats-matcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });

      if (!response.ok) throw new Error("Failed to analyze");
      
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong with the ATS scan.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto mt-16 pt-10 border-t border-zinc-200">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold flex items-center justify-center gap-3 text-zinc-900">
          <FileText className="text-indigo-600 w-8 h-8" />
          ATS Resume Surgeon
        </h2>
        <p className="text-zinc-500 text-sm mt-2 max-w-xl mx-auto">
          Paste your resume and the job description. The AI will calculate your match score and rewrite your weak bullet points to pass the filter.
        </p>
      </div>

      {/* Input Phase */}
      {!analysis && (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200">
            {/* Left: Job Description */}
            <div className="p-6 bg-zinc-50 flex flex-col h-[500px]">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500" /> Target Job Description
              </label>
              <textarea
                className="flex-grow w-full p-4 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm bg-white shadow-inner"
                placeholder="Paste the requirements and responsibilities from the job posting here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Right: User Resume */}
            <div className="p-6 bg-zinc-50 flex flex-col h-[500px]">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" /> Your Current Resume
              </label>
              <textarea
                className="flex-grow w-full p-4 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none text-sm bg-white shadow-inner"
                placeholder="Paste your entire resume text here..."
                value={resume}
                onChange={(e) => setResume(e.target.value)}
              />
            </div>
          </div>
          
          <div className="p-6 border-t border-zinc-200 bg-white">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resume || !jobDescription}
              className="w-full bg-indigo-950 text-white font-bold py-4 rounded-xl hover:bg-indigo-900 disabled:opacity-50 flex justify-center items-center gap-2 transition-all shadow-md"
            >
              {isAnalyzing ? <><Loader2 className="animate-spin w-5 h-5" /> Scanning via ATS Algorithm...</> : "Run Full ATS Scan"}
            </button>
          </div>
        </div>
      )}

      {/* Analysis Phase */}
      {analysis && (
        <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-8">
          
          {/* Header Dashboard */}
          <div className="bg-zinc-950 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl text-white">
            <div className="flex flex-col items-center justify-center p-6 bg-zinc-900 border border-zinc-800 rounded-full w-40 h-40 shrink-0 relative">
              <span className={`text-4xl font-black ${analysis.matchScore >= 75 ? 'text-emerald-400' : analysis.matchScore >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                {analysis.matchScore}%
              </span>
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider mt-1">Match Rate</span>
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#27272a" strokeWidth="4" />
                <circle cx="50" cy="50" r="48" fill="none" stroke={analysis.matchScore >= 75 ? '#34d399' : analysis.matchScore >= 50 ? '#fbbf24' : '#fb7185'} strokeWidth="4" strokeDasharray={`${analysis.matchScore * 3}, 300`} strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-3 flex items-center gap-2"><Target className="text-indigo-400"/> ATS Verdict</h3>
              <p className="text-zinc-400 leading-relaxed text-sm max-w-2xl">{analysis.verdict}</p>
            </div>
          </div>

          {/* Keyword Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                <h4 className="text-emerald-800 font-bold flex items-center gap-2 mb-4"><CheckCircle2 className="w-5 h-5" /> Matched Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.matched.map((k: string) => <span key={k} className="px-3 py-1 bg-white text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">{k}</span>)}
                </div>
             </div>
             <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl">
                <h4 className="text-rose-800 font-bold flex items-center gap-2 mb-4"><AlertOctagon className="w-5 h-5" /> Missing Critical Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.missingCritical.map((k: string) => <span key={k} className="px-3 py-1 bg-white text-rose-700 border border-rose-200 rounded-lg text-xs font-bold">{k}</span>)}
                </div>
             </div>
          </div>

          {/* The Bullet Surgeon */}
          <div className="mt-4">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <Sparkles className="text-indigo-600" /> The Line-by-Line Surgeon
            </h3>
            <p className="text-sm text-zinc-500 mb-6">Replace these weak bullet points in your resume with the AI-optimized versions below to increase your match score.</p>
            
            <div className="space-y-6">
              {analysis.bulletSurgeon.map((bullet: any, idx: number) => (
                <div key={idx} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
                  {/* Before */}
                  <div className="p-6 bg-zinc-50 md:w-1/2 border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col justify-center">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Original Bullet</span>
                    <p className="text-sm text-zinc-600 line-through decoration-rose-300 decoration-2">{bullet.original}</p>
                    <div className="mt-4 p-3 bg-white rounded-lg border border-zinc-200">
                      <span className="text-[10px] font-bold text-rose-500 uppercase block mb-1">Issue Detected</span>
                      <p className="text-xs text-zinc-600">{bullet.reason}</p>
                    </div>
                  </div>
                  
                  {/* Arrow Indicator (Desktop) */}
                  <div className="hidden md:flex items-center justify-center -ml-4 -mr-4 z-10">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shadow-md border-4 border-white">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* After */}
                  <div className="p-6 bg-indigo-50/50 md:w-1/2 flex flex-col justify-center relative group">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Optimized Bullet</span>
                    <p className="text-sm text-zinc-900 font-medium leading-relaxed">{bullet.upgraded}</p>
                    
                    <button 
                      onClick={() => handleCopy(bullet.upgraded, idx)}
                      className="mt-4 self-start flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm"
                    >
                      {copiedIndex === idx ? <><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Copied!</> : <><Copy className="w-4 h-4"/> Copy to Clipboard</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8">
             <button 
               onClick={() => { setAnalysis(null); }}
               className="text-sm font-bold text-zinc-500 hover:text-zinc-800 underline underline-offset-4"
             >
               Scan Another Resume
             </button>
          </div>
        </div>
      )}
    </div>
  );
}