"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Send, Code, Loader2, Copy, CheckCircle2, Briefcase, Target, ShieldAlert } from "lucide-react";

export default function CareerStrategyHub() {
  const [isLoading, setIsLoading] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Negotiator State
  const [negRole, setNegRole] = useState("");
  const [negOffer, setNegOffer] = useState("");
  const [negSize, setNegSize] = useState("Mid-Size (50-500)");
  const [negResult, setNegResult] = useState<any>(null);

  // Outreach State
  const [outCompany, setOutCompany] = useState("");
  const [outNews, setOutNews] = useState("");
  const [outResult, setOutResult] = useState<any>(null);

  // PoW State
  const [powJD, setPowJD] = useState("");
  const [powResult, setPowResult] = useState<any>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAction = async (actionType: string, payload: any, setter: any) => {
    setIsLoading(true);
    setter(null);
    try {
      const response = await fetch("/api/career-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionType, ...payload }),
      });
      const data = await response.json();
      setter(data);
    } catch (error) {
      alert("Strategy engine failed to respond.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black flex items-center justify-center gap-3 text-zinc-900 tracking-tight">
          <Target className="text-rose-600 w-10 h-10" />
          The Offensive Playbook
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">Don't just apply. Negotiate higher offers, bypass the ATS, and prove your worth.</p>
      </div>

      <Tabs defaultValue="negotiator" className="w-full">
        <TabsList className="grid grid-cols-3 bg-zinc-200/50 p-1 rounded-xl mb-8">
          <TabsTrigger value="negotiator" className="py-3 font-bold flex gap-2"><DollarSign size={18}/> Offer Negotiator</TabsTrigger>
          <TabsTrigger value="outreach" className="py-3 font-bold flex gap-2"><Send size={18}/> Network Autopilot</TabsTrigger>
          <TabsTrigger value="pow" className="py-3 font-bold flex gap-2"><Code size={18}/> Proof of Work</TabsTrigger>
        </TabsList>

        {/* TAB 1: OFFER NEGOTIATOR */}
        <TabsContent value="negotiator" className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm grid md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h3 className="text-xl font-bold flex items-center gap-2"><DollarSign className="text-emerald-500"/> Salary Negotiator</h3>
              <p className="text-sm text-zinc-500">Enter your initial offer. The AI will simulate HR pushback and write your counter-offer script.</p>
              <input className="w-full p-4 border border-zinc-300 rounded-xl bg-zinc-50 text-sm" placeholder="Target Role (e.g. Senior Frontend)" value={negRole} onChange={e => setNegRole(e.target.value)} />
              <input className="w-full p-4 border border-zinc-300 rounded-xl bg-zinc-50 text-sm" placeholder="Initial Offer (e.g. $120,000 or ₹15 LPA)" value={negOffer} onChange={e => setNegOffer(e.target.value)} />
              <select className="w-full p-4 border border-zinc-300 rounded-xl bg-zinc-50 text-sm" value={negSize} onChange={e => setNegSize(e.target.value)}>
                <option>Startup (1-50)</option>
                <option>Mid-Size (50-500)</option>
                <option>Enterprise (500+)</option>
              </select>
              <button onClick={() => handleAction("negotiate", { role: negRole, offer: negOffer, companySize: negSize }, setNegResult)} disabled={isLoading || !negOffer} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all flex justify-center items-center gap-2">
                {isLoading ? <Loader2 className="animate-spin w-5 h-5"/> : "Generate Counter-Strategy"}
              </button>
            </div>

            {negResult && (
              <div className="bg-zinc-950 text-white rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in">
                <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
                  <div className="p-3 bg-emerald-500/20 rounded-full"><DollarSign className="text-emerald-400 w-6 h-6"/></div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Leverage Score</p>
                    <p className="text-2xl font-black text-emerald-400">{negResult.powerScore}/100</p>
                  </div>
                </div>
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> HR Pushback Simulation</p>
                  <p className="text-sm text-zinc-300 italic">"{negResult.hrPushback}"</p>
                </div>
                <div className="flex-grow">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Your Counter Email</p>
                  <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900 p-4 rounded-xl border border-zinc-800">{negResult.emailScript}</p>
                </div>
                <button onClick={() => handleCopy(negResult.emailScript)} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 flex justify-center items-center gap-2">
                  {copiedText === negResult.emailScript ? <><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Copied</> : <><Copy className="w-4 h-4"/> Copy Script</>}
                </button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB 2: NETWORK AUTOPILOT */}
        <TabsContent value="outreach" className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8">
             <div className="md:w-1/3 space-y-5">
                <h3 className="text-xl font-bold flex items-center gap-2"><Send className="text-blue-500"/> Network Autopilot</h3>
                <p className="text-sm text-zinc-500">Cold email templates that actually get replies. Feed the AI company news to make it highly personalized.</p>
                <input className="w-full p-4 border border-zinc-300 rounded-xl bg-zinc-50 text-sm" placeholder="Target Company (e.g. Stripe)" value={outCompany} onChange={e => setOutCompany(e.target.value)} />
                <textarea className="w-full p-4 border border-zinc-300 rounded-xl bg-zinc-50 text-sm resize-none" rows={3} placeholder="Recent News (e.g. Just launched a new AI billing feature...)" value={outNews} onChange={e => setOutNews(e.target.value)} />
                <button onClick={() => handleAction("outreach", { company: outCompany, news: outNews }, setOutResult)} disabled={isLoading || !outCompany} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
                  {isLoading ? <Loader2 className="animate-spin w-5 h-5"/> : "Draft Outreach"}
                </button>
             </div>

             {outResult && (
               <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                  {[
                    { title: "Coffee Chat", text: outResult.coffeeChat, color: "text-amber-600", bg: "bg-amber-50" },
                    { title: "Direct Pitch", text: outResult.directPitch, color: "text-rose-600", bg: "bg-rose-50" },
                    { title: "Referral Ask", text: outResult.referralRequest, color: "text-blue-600", bg: "bg-blue-50" }
                  ].map((email, idx) => (
                    <div key={idx} className={`${email.bg} border border-zinc-200 p-5 rounded-2xl flex flex-col`}>
                      <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${email.color}`}>{email.title}</p>
                      <p className="text-sm text-zinc-700 flex-grow mb-4 whitespace-pre-line">{email.text}</p>
                      <button onClick={() => handleCopy(email.text)} className="mt-auto text-xs font-bold bg-white border border-zinc-300 py-2 rounded-lg hover:bg-zinc-50 transition-colors flex justify-center items-center gap-2">
                         {copiedText === email.text ? <CheckCircle2 className="w-4 h-4 text-emerald-500"/> : <Copy className="w-4 h-4"/>} Copy
                      </button>
                    </div>
                  ))}
               </div>
             )}
          </div>
        </TabsContent>

        {/* TAB 3: PROOF OF WORK */}
        <TabsContent value="pow" className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 space-y-5">
              <h3 className="text-xl font-bold flex items-center gap-2"><Code className="text-indigo-500"/> Proof of Work</h3>
              <p className="text-sm text-zinc-500">Skip the resume pile. Paste a JD, and the AI will design a 48-hour project you can build to prove you can do the job.</p>
              <textarea className="w-full p-4 border border-zinc-300 rounded-xl bg-zinc-50 text-sm resize-none h-48" placeholder="Paste the full Job Description here..." value={powJD} onChange={e => setPowJD(e.target.value)} />
              <button onClick={() => handleAction("pow", { jd: powJD }, setPowResult)} disabled={isLoading || !powJD} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all flex justify-center items-center gap-2">
                {isLoading ? <Loader2 className="animate-spin w-5 h-5"/> : "Architect Weekend Project"}
              </button>
            </div>

            {powResult && (
              <div className="md:w-2/3 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 animate-in fade-in flex flex-col gap-6">
                <div>
                  <h4 className="text-2xl font-black text-indigo-900">{powResult.projectTitle}</h4>
                  <div className="flex gap-2 mt-3">
                    {powResult.techStack.map((tech: string, i: number) => <span key={i} className="px-3 py-1 bg-white border border-zinc-200 text-xs font-bold rounded-lg text-indigo-600">{tech}</span>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Architecture & Goal</p>
                  <p className="text-sm text-zinc-700 leading-relaxed">{powResult.architecture}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">48-Hour Execution Plan</p>
                  <ul className="space-y-3">
                    {powResult.executionSteps.map((step: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-800"><div className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">{i+1}</div>{step}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 text-white">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex justify-between">The Pitch Message <button onClick={() => handleCopy(powResult.pitchMessage)}><Copy className="w-4 h-4 hover:text-white text-zinc-400"/></button></p>
                  <p className="text-sm text-zinc-300 italic">"{powResult.pitchMessage}"</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}