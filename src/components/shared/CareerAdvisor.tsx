"use client";

import { useState } from "react";
import { Loader2, BrainCircuit, CheckCircle2 } from "lucide-react";

export default function CareerAdvisor() {
  const [dilemma, setDilemma] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [advice, setAdvice] = useState<any>(null);

  const handleAsk = async () => {
    if (!dilemma.trim()) return;
    setIsThinking(true);
    setAdvice(null);

    try {
      const response = await fetch("/api/career-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dilemma }),
      });

      if (!response.ok) throw new Error("Failed to get advice");
      
      const data = await response.json();
      setAdvice(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again!");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto gap-6 mt-16 pt-10 border-t border-zinc-200">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <BrainCircuit className="text-purple-500" />
          AI Career Decision Advisor
        </h2>
        <p className="text-zinc-500 text-sm mt-1">Stuck between two choices? Let AI break it down.</p>
      </div>

      {/* Input Section */}
      <div className="flex flex-col gap-3">
        <textarea
          className="w-full p-4 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none"
          rows={3}
          placeholder="e.g., Should I take a $100k job at a boring bank, or an $80k job at a fast-growing AI startup?"
          value={dilemma}
          onChange={(e) => setDilemma(e.target.value)}
        />
        <button
          onClick={handleAsk}
          disabled={isThinking || !dilemma}
          className="bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-all"
        >
          {isThinking ? <><Loader2 className="animate-spin w-5 h-5" /> Analyzing tradeoff...</> : "Get Expert Advice"}
        </button>
      </div>

      {/* Results Section */}
      {advice && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
            <h3 className="text-xs font-bold text-purple-600 uppercase mb-2">The Core Tradeoff</h3>
            <p className="text-purple-900 font-medium">{advice.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
              <h3 className="text-sm font-bold text-zinc-800 border-b pb-2 mb-3">Path A Highlights</h3>
              <ul className="space-y-2">
                {advice.prosOptionA?.map((pro: string, i: number) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
              <h3 className="text-sm font-bold text-zinc-800 border-b pb-2 mb-3">Path B Highlights</h3>
              <ul className="space-y-2">
                {advice.prosOptionB?.map((pro: string, i: number) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {pro}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-5 bg-zinc-900 rounded-xl text-white shadow-md">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Final Recommendation</h3>
            <p className="text-sm leading-relaxed">{advice.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}