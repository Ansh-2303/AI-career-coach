"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, User, Bot, Loader2, Award, Mic, StopCircle, CheckCircle2, AlertOctagon, ChevronRight } from "lucide-react";

export default function MockInterview() {
  const [role, setRole] = useState("");
  const [resumeContext, setResumeContext] = useState("");
  
  // Continuous State
  const [history, setHistory] = useState<{question: string, answer: string}[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [finalReport, setFinalReport] = useState<any>(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setCurrentAnswer(currentTranscript);
        };
        recognitionRef.current.onerror = (event: any) => {
          setIsListening(false);
          if (event.error === "not-allowed") alert("Microphone access is blocked! Please allow it in your browser URL bar.");
        };
      }
    }
  }, []);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setCurrentAnswer("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // 1. Fetch the Next Question (Used for Start AND subsequent rounds)
  const fetchNextQuestion = async (currentHistory: any[]) => {
    setIsLoading(true);
    window.speechSynthesis.cancel();
    
    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generateNext", role, resumeContext, history: currentHistory }),
      });
      const data = await response.json();
      if (data.question) {
        setCurrentQuestion(data.question);
        setCurrentAnswer(""); // Clear input for the next round
        speakText(data.question);
      }
    } catch (error) {
      alert("Failed to connect to the interviewer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Start the Interview
  const handleStart = () => {
    if (!role.trim()) return;
    setHistory([]);
    setFinalReport(null);
    setIsInterviewActive(true);
    fetchNextQuestion([]);
  };

  // Submit Answer & Go to Next Round
  const handleNextRound = () => {
    if (!currentAnswer.trim()) return;
    if (isListening) toggleListening();
    
    const updatedHistory = [...history, { question: currentQuestion, answer: currentAnswer }];
    setHistory(updatedHistory);
    fetchNextQuestion(updatedHistory);
  };

  // End Interview & Get Full Analysis
  const handleEndInterview = async () => {
    if (isListening) toggleListening();
    window.speechSynthesis.cancel();
    
    // Save the very last answer if they typed it but didn't hit 'next'
    const finalHistory = currentAnswer.trim() ? [...history, { question: currentQuestion, answer: currentAnswer }] : history;
    
    if (finalHistory.length === 0) {
      setIsInterviewActive(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "evaluateAll", role, history: finalHistory }),
      });
      const data = await response.json();
      setFinalReport(data);
      setIsInterviewActive(false); // End the live session
    } catch (error) {
      alert("Failed to generate final report.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto mt-16 pt-10 border-t border-zinc-200">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold flex items-center justify-center gap-3 text-zinc-900">
          <MessageSquare className="text-rose-600 w-8 h-8" />
          The Gauntlet: Live Interview Simulator
        </h2>
        <p className="text-zinc-500 text-sm mt-2">Continuous, multi-round AI interviews with per-question analytical reporting.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Step 1: Context Setup (Only show if interview hasn't started and report isn't showing) */}
        {!isInterviewActive && !finalReport && (
          <div className="p-8 bg-zinc-50 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase block mb-2">Target Role</label>
                  <input
                    type="text"
                    className="w-full p-4 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                    placeholder="e.g., Senior React Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
               </div>
               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase block mb-2">Your Context</label>
                  <input
                    type="text"
                    className="w-full p-4 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                    placeholder="Briefly describe your recent projects or stack..."
                    value={resumeContext}
                    onChange={(e) => setResumeContext(e.target.value)}
                  />
               </div>
            </div>
            <button
              onClick={handleStart}
              disabled={!role || isLoading}
              className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl hover:bg-rose-700 transition-all"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Enter The Gauntlet"}
            </button>
          </div>
        )}

        {/* Step 2: The Live Interview Studio */}
        {isInterviewActive && (
          <div className="flex flex-col h-[600px] bg-zinc-950 text-white relative">
            {/* Header Tracker */}
            <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-zinc-900">
              <span className="text-rose-500 font-black tracking-widest uppercase text-xs">Round {history.length + 1}</span>
              <button 
                onClick={handleEndInterview} 
                disabled={isLoading}
                className="text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin w-3 h-3" /> : <StopCircle className="w-3 h-3"/>}
                End & Evaluate
              </button>
            </div>

            {/* Studio Area */}
            <div className="flex-grow p-8 overflow-y-auto flex flex-col justify-center gap-10">
              {isLoading && !currentQuestion ? (
                <div className="flex flex-col items-center opacity-50"><Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-4" /><p>Interviewer is reviewing your file...</p></div>
              ) : (
                <>
                  {/* AI Question */}
                  <div className="flex gap-6 items-start">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${isSpeaking ? 'bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.4)]' : 'bg-zinc-800'}`}>
                      <Bot className={`w-7 h-7 ${isSpeaking ? 'text-white' : 'text-rose-400'}`} />
                    </div>
                    <div className="pt-2">
                      <span className="font-bold text-xs text-rose-400 uppercase tracking-wider mb-2 block">AI Hiring Manager</span>
                      <p className="text-xl leading-relaxed text-zinc-100">{currentQuestion}</p>
                    </div>
                  </div>

                  {/* User Input */}
                  <div className="flex gap-6 flex-row-reverse items-start mt-4">
                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div className="w-full max-w-3xl flex flex-col items-end">
                      <button 
                        onClick={toggleListening}
                        className={`mb-4 flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                      >
                        {isListening ? <><StopCircle className="w-4 h-4"/> Recording...</> : <><Mic className="w-4 h-4"/> Hold to Speak</>}
                      </button>
                      <textarea
                        className="w-full p-6 bg-zinc-900 border border-zinc-800 rounded-3xl rounded-tr-none focus:ring-2 focus:ring-blue-500 outline-none resize-none text-base text-zinc-100"
                        rows={4}
                        placeholder="Type or dictate your answer..."
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                      />
                      <button
                        onClick={handleNextRound}
                        disabled={isLoading || !currentAnswer.trim()}
                        className="mt-6 bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        Submit & Next Round <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Final Per-Question Analytics Dashboard */}
        {finalReport && !isInterviewActive && (
          <div className="p-8 bg-zinc-50 animate-in fade-in slide-in-from-bottom-8">
            {/* Header Score */}
            <div className="bg-zinc-950 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl text-white mb-8">
              <div className="flex flex-col items-center justify-center p-6 bg-zinc-900 border border-zinc-800 rounded-full w-40 h-40 shrink-0">
                <span className="text-5xl font-black text-rose-500">{finalReport.overallScore}<span className="text-2xl text-zinc-600">/10</span></span>
                <span className="text-xs text-zinc-400 font-bold uppercase mt-2">Final Score</span>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-3">Interview Post-Mortem</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{finalReport.overallSummary}</p>
              </div>
            </div>

            <h4 className="font-bold text-zinc-800 mb-6 text-xl">Per-Question Breakdown</h4>
            
            {/* Breakdown List */}
            <div className="space-y-6">
              {finalReport.perQuestionAnalysis.map((item: any, idx: number) => (
                <div key={idx} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-5 bg-zinc-100 border-b border-zinc-200 flex items-start gap-4">
                    <span className="bg-zinc-800 text-white font-bold text-xs px-3 py-1 rounded-full shrink-0 mt-0.5">Q{idx + 1}</span>
                    <p className="font-bold text-zinc-800">{item.question}</p>
                  </div>
                  <div className="p-5 bg-white">
                    <p className="text-sm text-zinc-600 mb-6">"{item.answer}"</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                        <p className="text-xs font-bold text-rose-600 uppercase mb-2 flex justify-between">Feedback <span>Score: {item.score}/10</span></p>
                        <p className="text-sm text-zinc-800">{item.feedback}</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-xs font-bold text-emerald-600 uppercase mb-2">The Ideal Answer</p>
                        <p className="text-sm text-zinc-800 italic">{item.idealAnswer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => { setFinalReport(null); setRole(""); setResumeContext(""); }}
              className="mt-10 w-full bg-zinc-200 text-zinc-800 font-bold py-4 rounded-xl hover:bg-zinc-300"
            >
              Start a New Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}