"use client";

import { useState } from "react";
import { TrendingUp, DollarSign, Activity, Loader2, Zap } from "lucide-react";

export default function IndustryInsights() {
  const [role, setRole] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [insights, setInsights] = useState<any>(null);

  const handleFetchInsights = async () => {
    if (!role.trim()) return;
    setIsFetching(true);
    setInsights(null);

    try {
      const response = await fetch("/api/industry-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) throw new Error("Failed to fetch insights");
      
      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong fetching market data.");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto mt-16 pt-10 border-t border-zinc-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <TrendingUp className="text-teal-500" />
          Industry Insights
        </h2>
        <p className="text-zinc-500 text-sm mt-1">Get real-time market data, salary trends, and skill demands for any role.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto w-full">
        <input
          type="text"
          className="flex-grow w-full p-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm"
          placeholder="e.g., Cloud Architect, Product Manager, Data Scientist"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button
          onClick={handleFetchInsights}
          disabled={isFetching || !role}
          className="bg-teal-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-teal-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-all whitespace-nowrap"
        >
          {isFetching ? <><Loader2 className="animate-spin w-4 h-4" /> Analyzing Market...</> : "Get Insights"}
        </button>
      </div>

      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Salary Card */}
          <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Avg Salary Range</h3>
            <p className="text-2xl font-black text-zinc-800">{insights.salaryRange}</p>
          </div>

          {/* Demand Card */}
          <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Market Demand</h3>
            <p className="text-2xl font-black text-zinc-800">{insights.demandLevel}</p>
          </div>

          {/* Top Skills Card */}
          <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Top Requested Skills</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {insights.topSkills?.map((skill: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-zinc-100 text-zinc-700 text-xs font-bold rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Outlook Span */}
          <div className="md:col-span-3 p-5 bg-teal-50 border border-teal-100 rounded-xl text-teal-900 text-sm leading-relaxed">
            <span className="font-bold block mb-1">Market Outlook:</span>
            {insights.outlook}
          </div>

        </div>
      )}
    </div>
  );
}