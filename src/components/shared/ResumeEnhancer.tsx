"use client";

import { useState } from "react";
import { PenTool, Sparkles, Check, Copy } from "lucide-react";

export default function ResumeEnhancer() {
  const [weakBullet, setWeakBullet] = useState("");
  const [roleContext, setRoleContext] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedOptions, setEnhancedOptions] = useState<string[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

 const handleEnhance = async () => {
    if (!weakBullet.trim()) return;
    setIsEnhancing(true);
    setEnhancedOptions(null);

    try {
      const response = await fetch("/api/enhance-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weakBullet, roleContext }),
      });

      if (!response.ok) throw new Error("Failed to enhance bullet point");
      
      const data = await response.json();
      
      if (data.enhancedBullets && Array.isArray(data.enhancedBullets)) {
        // THE FIX: Clean the data before setting it into React state
        const safeBullets = data.enhancedBullets.map((item: any) => {
          if (typeof item === "string") return item;
          // If the AI accidentally returned an object like { "First alternative": "The actual text" }
          if (typeof item === "object" && item !== null) {
            return Object.values(item)[0] as string; // Extract the string value
          }
          return "Error parsing this bullet point.";
        });
        
        setEnhancedOptions(safeBullets);
      } else {
        throw new Error("Invalid AI response format");
      }
      
    } catch (error) {
      console.error(error);
      alert("Something went wrong while upgrading your resume.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto mt-16 pt-10 border-t border-zinc-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <PenTool className="text-orange-500" />
          AI Resume Bullet Enhancer
        </h2>
        <p className="text-zinc-500 text-sm mt-1">Turn boring task descriptions into powerful, interview-winning achievements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Inputs */}
        <div className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-semibold text-zinc-700 block mb-1">Your Current Bullet Point</label>
            <textarea
              className="w-full p-4 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none text-sm"
              rows={4}
              placeholder="e.g., fixed bugs in the database and made it faster"
              value={weakBullet}
              onChange={(e) => setWeakBullet(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-zinc-700 block mb-1">Target Role (Optional)</label>
            <input
              type="text"
              className="w-full p-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              placeholder="e.g., Senior Backend Engineer"
              value={roleContext}
              onChange={(e) => setRoleContext(e.target.value)}
            />
          </div>
          <button
            onClick={handleEnhance}
            disabled={isEnhancing || !weakBullet}
            className="bg-orange-600 text-white font-semibold py-3 rounded-xl hover:bg-orange-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-all shadow-sm"
          >
            {isEnhancing ? (
              <><Sparkles className="animate-pulse w-5 h-5" /> Upgrading...</>
            ) : (
              "Upgrade Bullet Point"
            )}
          </button>
        </div>

        {/* Right Side: Results */}
        <div className="flex flex-col h-full">
          {!enhancedOptions ? (
            <div className="h-full border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center text-zinc-400 p-8 text-center bg-zinc-50/50 min-h-[250px]">
              <Sparkles className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm">Paste a bullet point on the left to see AI-enhanced, action-driven alternatives here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-sm font-bold text-zinc-800 mb-1">Choose an upgraded version:</h3>
              {enhancedOptions.map((option, index) => (
               <div key={index} className="p-4 bg-white border border-orange-100 rounded-xl shadow-sm hover:border-orange-300 transition-colors group relative pr-12">
                 <p className="text-sm text-zinc-700">{option}</p>
                 <button 
                   onClick={() => handleCopy(option, index)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                   title="Copy to clipboard"
                 >
                   {copiedIndex === index ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                 </button>
               </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}