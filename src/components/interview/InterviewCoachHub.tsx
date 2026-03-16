"use client"

import { motion } from "framer-motion"
import { Camera, Mic, Brain, AudioWaveform } from "lucide-react"

import VideoUploader from "@/components/shared/VideoUploader"
import MockInterview from "@/components/shared/MockInterview"

export default function InterviewCoachHub() {

  return (
    <div className="w-full max-w-7xl mx-auto">

      {/* Header */}

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="text-indigo-600"/>
          Interview Hub
        </h1>

        <p className="text-zinc-500 mt-2">
          Practice interviews and analyze your video performance with AI.
        </p>
      </div>


      {/* GRID LAYOUT */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT — MOCK INTERVIEW */}

        <motion.div
          initial={{opacity:0, x:-20}}
          animate={{opacity:1, x:0}}
          transition={{duration:0.3}}
          className="bg-white border border-zinc-200 rounded-2xl shadow-lg p-6 relative overflow-hidden"
        >

          {/* glowing border */}

          <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[0_0_20px_rgba(79,70,229,0.15)]"></div>

          <div className="flex items-center gap-2 mb-4">
            <Mic className="text-indigo-600"/>
            <h2 className="font-semibold text-lg">Practice Session</h2>
          </div>

          <p className="text-zinc-500 text-sm mb-6">
            Chat with the AI interviewer and receive instant feedback.
          </p>

          {/* chat component */}

          <MockInterview />

        </motion.div>



        {/* RIGHT — VIDEO ANALYSIS */}

        <motion.div
          initial={{opacity:0, x:20}}
          animate={{opacity:1, x:0}}
          transition={{duration:0.3}}
          className="bg-zinc-900 text-white rounded-2xl shadow-xl p-6 relative overflow-hidden"
        >

          {/* glowing border */}

          <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[0_0_30px_rgba(99,102,241,0.3)]"></div>

          <div className="flex items-center gap-2 mb-4">
            <Camera className="text-indigo-400"/>
            <h2 className="font-semibold text-lg">Video Analysis Studio</h2>
          </div>

          <p className="text-zinc-400 text-sm mb-6">
            Upload your interview recording and receive AI feedback on delivery,
            tone, and confidence.
          </p>


          {/* recording indicator */}

          <div className="flex items-center gap-2 mb-4 text-red-400 text-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Processing video analysis
          </div>

          <div className="border border-zinc-700 rounded-xl p-4 bg-zinc-800">

            <VideoUploader />

          </div>

          <div className="flex gap-4 mt-6 text-zinc-400 text-sm">

            <div className="flex items-center gap-1">
              <Mic size={16}/>
              Audio Tone
            </div>

            <div className="flex items-center gap-1">
             <AudioWaveform size={16}/>
              Delivery
            </div>

            <div className="flex items-center gap-1">
              <Brain size={16}/>
              AI Feedback
            </div>

          </div>

        </motion.div>

      </div>

    </div>
  )
}