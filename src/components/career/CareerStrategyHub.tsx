"use client"

import { motion } from "framer-motion"
import {
  Brain,
  TrendingUp,
  Compass,
  Target,
  Sparkles
} from "lucide-react"

import CareerSkillGapAnalyzer from "@/components/shared/CareerSkillGapAnalyzer"
import IndustryInsights from "@/components/shared/IndustryInsights"
import CareerAdvisor from "@/components/shared/CareerAdvisor"

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function CareerStrategyHub() {
  return (
    <div className="w-full max-w-7xl mx-auto">

      {/* Header */}

      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Compass className="text-indigo-600" />
          Career Strategy Hub
        </h1>

        <p className="text-zinc-500 mt-2">
          Plan your future with AI-powered career intelligence.
        </p>
      </div>


      {/* Strategy Score (visual only) */}

      <motion.div
        initial={{opacity:0, scale:0.95}}
        animate={{opacity:1, scale:1}}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 mb-12 shadow-xl"
      >
        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Target size={18}/>
              Career Readiness Score
            </h2>

            <p className="text-indigo-100 text-sm mt-1">
              AI evaluation of your current career positioning
            </p>
          </div>

          <div className="text-right">
            <span className="text-4xl font-black">78%</span>
            <p className="text-xs text-indigo-200 uppercase tracking-wide">
              Strategy Score
            </p>
          </div>

        </div>
      </motion.div>


      {/* ROADMAP SECTION */}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-16"
      >

        <motion.div
          variants={item}
          className="flex items-center gap-2 mb-6"
        >
          <Sparkles className="text-indigo-600"/>
          <h2 className="text-xl font-semibold">
            Career Roadmap
          </h2>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-white border border-zinc-200 rounded-2xl shadow-lg p-6 relative overflow-hidden"
        >

          {/* glowing timeline effect */}

          <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500 via-indigo-300 to-transparent opacity-40"></div>

          <CareerSkillGapAnalyzer />

        </motion.div>

      </motion.div>



      {/* INSIGHTS DASHBOARD */}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mb-16"
      >

        <motion.div
          variants={item}
          className="flex items-center gap-2 mb-6"
        >
          <TrendingUp className="text-emerald-500"/>
          <h2 className="text-xl font-semibold">
            Industry Insights Dashboard
          </h2>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-zinc-950 text-white rounded-2xl p-6 shadow-xl border border-zinc-800"
        >

          {/* analytics header */}

          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-zinc-200">
              Market Intelligence
            </h3>

            <TrendingUp className="text-emerald-400"/>
          </div>

          <IndustryInsights />

        </motion.div>

      </motion.div>



      {/* DECISION ADVISOR */}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >

        <motion.div
          variants={item}
          className="flex items-center gap-2 mb-6"
        >
          <Brain className="text-indigo-600"/>
          <h2 className="text-xl font-semibold">
            Career Decision Advisor
          </h2>
        </motion.div>

        <motion.div
          variants={item}
          className="grid md:grid-cols-2 gap-6"
        >

          {/* Option A */}

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">

            <h3 className="font-semibold mb-3">
              Option A
            </h3>

            <CareerAdvisor />

          </div>

          {/* Option B placeholder visual */}

          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 shadow-lg">

            <h3 className="font-semibold mb-3 text-zinc-700">
              Comparison Insights
            </h3>

            <p className="text-sm text-zinc-500">
              AI will analyze tradeoffs between your career options,
              comparing salary growth, learning curve, and long-term demand.
            </p>

          </div>

        </motion.div>

      </motion.div>

    </div>
  )
}