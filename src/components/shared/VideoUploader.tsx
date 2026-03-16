"use client";

import { useState, useEffect } from "react";
import { Upload, FileVideo, Loader2, CheckCircle, MonitorPlay, Sparkles, Scissors, ArrowRight } from "lucide-react";

export default function VideoUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<any>(null);

  // Simulated complex pipeline for UI UX
  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const loadingMessages = [
    "Uploading to Secure Vault...",
    "Extracting Audio via AssemblyAI...",
    "Running Sentiment & Pacing Matrix...",
    "Directing B-Roll & Highlights..."
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/analyze-video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Something went wrong with the analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-6 mt-10">
      
      {/* Original Upload Box styling preserved */}
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-300 rounded-xl bg-white shadow-sm">
        {!file ? (
          <div className="flex flex-col items-center">
            <Upload className="w-10 h-10 text-zinc-400 mb-4" />
            <p className="text-sm text-zinc-600 mb-4">Select a short intro video (Under 10MB for testing)</p>
            <label className="cursor-pointer bg-black text-white px-5 py-2.5 rounded-lg hover:bg-zinc-800 transition-all font-medium">
              Choose Video
              <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <FileVideo className="w-12 h-12 text-blue-500 mb-3" />
            <p className="text-sm font-medium text-zinc-800 truncate max-w-xs mb-6">
              {file.name}
            </p>
            
            {isAnalyzing ? (
              <div className="w-full max-w-md">
                <div className="flex justify-between text-xs font-bold text-blue-600 uppercase mb-2">
                  <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> {loadingMessages[loadingStep]}</span>
                  <span>{loadingStep + 1}/4</span>
                </div>
                <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                    style={{ width: `${((loadingStep + 1) / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setFile(null)} className="px-4 py-2 text-sm text-zinc-600 border border-zinc-300 rounded-lg hover:bg-zinc-50 font-medium">
                  Cancel
                </button>
                <button onClick={handleUpload} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium shadow-sm">
                  Start Advanced Analysis
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Box */}
      {result && (
        <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-4 w-full">
          <div className="flex items-center gap-2 mb-6 text-green-600 font-bold border-b border-zinc-100 pb-4">
            <CheckCircle className="w-6 h-6" />
            AI Coach Analysis Complete
          </div>
          
          {/* ORIGINAL FEATURES PRESERVED */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Pitch Score</p>
              <p className="text-4xl font-black text-blue-900">{result.aiFeedback?.score}<span className="text-xl text-blue-400">/10</span></p>
            </div>
            
            <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 col-span-2 space-y-3">
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase">Clarity</p>
                <p className="text-sm font-medium text-zinc-800">{result.aiFeedback?.clarity}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase">Filler Words Detected</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.aiFeedback?.fillerWords?.length > 0 ? (
                    result.aiFeedback.fillerWords.map((word: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-semibold">{word}</span>
                    ))
                  ) : (
                    <span className="text-sm text-zinc-500">None detected. Great job!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
              <p className="text-xs font-bold text-green-600 uppercase mb-1">Strengths</p>
              <p className="text-sm text-green-900">{result.aiFeedback?.strengths}</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs font-bold text-amber-600 uppercase mb-1">Area for Improvement</p>
              <p className="text-sm text-amber-900">{result.aiFeedback?.improvement}</p>
            </div>
          </div>

          {/* NEW HEAVY FEATURES */}
          <div className="border-t border-zinc-200 pt-8 mb-8">
            <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2"><MonitorPlay className="text-indigo-500" /> Advanced Production Tools</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Highlight Reel */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4"/> The Highlight Reel</p>
                <div className="space-y-4">
                  {result.aiFeedback?.highlightReel?.map((highlight: any, idx: number) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-indigo-50">
                      <p className="text-sm font-medium text-zinc-800 italic mb-2">"{highlight.quote}"</p>
                      <p className="text-xs text-indigo-700 bg-indigo-100/50 p-2 rounded inline-block">{highlight.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* B-Roll Director */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5">
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-4 flex items-center gap-2"><Scissors className="w-4 h-4"/> B-Roll Director</p>
                <div className="space-y-4">
                  {result.aiFeedback?.bRollDirector?.map((broll: any, idx: number) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">When you say:</p>
                      <p className="text-xs text-zinc-600 italic mb-2">"{broll.triggerPhrase}"</p>
                      <p className="text-sm font-medium text-zinc-800 flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                        {broll.visualSuggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Original Transcript */}
          <div>
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Original Transcript</h3>
            <p className="text-zinc-600 bg-zinc-50 p-4 rounded-lg border border-zinc-100 text-xs leading-relaxed italic">
              "{result.text}"
            </p>
          </div>
          
        </div>
      )}
    </div>
  );
}