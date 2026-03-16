"use client";

import { useState } from "react";
import { FileText, Sparkles, Copy, Check } from "lucide-react";

export default function CoverLetterGenerator() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim() || !resume.trim()) return;
    setIsGenerating(true);
    setCoverLetter(null);
    setCopied(false);
    
    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });

      if (!response.ok) throw new Error("Failed to generate");
      
      const data = await response.json();
      
      if (data.coverLetter && typeof data.coverLetter === "string") {
        setCoverLetter(data.coverLetter);
      } else {
        throw new Error("Invalid AI response format");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong generating the cover letter.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto mt-16 pt-10 border-t border-zinc-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <FileText className="text-indigo-500" />
          AI Cover Letter Generator
        </h2>
        <p className="text-zinc-500 text-sm mt-1">Generate a highly tailored cover letter in seconds.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Inputs */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-zinc-700 block mb-2">1. Paste Your Resume</label>
            <textarea
              className="w-full h-48 p-4 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-xs text-zinc-600"
              placeholder="Paste your resume text here..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-zinc-700 block mb-2">2. Paste Job Description</label>
            <textarea
              className="w-full h-48 p-4 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-xs text-zinc-600"
              placeholder="Paste the job requirements here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !jobDescription || !resume}
            className="bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-all w-full"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2"><Sparkles className="animate-pulse w-5 h-5" /> Writing your letter...</span>
            ) : (
              "Generate Cover Letter"
            )}
          </button>
        </div>

        {/* Right Side: Output */}
        <div className="flex flex-col h-full">
          {!coverLetter ? (
            <div className="h-full border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center text-zinc-400 p-8 text-center bg-zinc-50/50 min-h-[400px]">
              <FileText className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">Provide your resume and a JD to generate a tailored cover letter.</p>
            </div>
          ) : (
            <div className="h-full border border-zinc-200 rounded-xl bg-white shadow-sm flex flex-col animate-in fade-in slide-in-from-right-4 relative group">
              <div className="flex justify-between items-center p-4 border-b border-zinc-100 bg-zinc-50 rounded-t-xl">
                <span className="text-sm font-bold text-zinc-700">Your Tailored Cover Letter</span>
                <button 
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                >
                  {copied ? <><Check className="w-3.5 h-3.5 text-green-500" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Text</>}
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[500px]">
                <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed font-serif">
                  {coverLetter}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}