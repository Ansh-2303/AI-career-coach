"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import {
  Sparkles,
  FileText,
  Mic,
  Compass,
  Rocket,
  ArrowRight,
  Brain,
  Target
} from "lucide-react"

import { getAverageInterviewScore } from "@/actions/metrics"

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

export default function OverviewDashboard() {

  const [avgScore, setAvgScore] = useState(0)

  useEffect(() => {
    async function loadScore() {
      const score = await getAverageInterviewScore()
      setAvgScore(score)
    }

    loadScore()
  }, [])

  const stats = [
    {
      label: "Resume Strength",
      value: "85%",
      icon: FileText,
      color: "text-indigo-600"
    },
    {
      label: "Interview Readiness",
      value: `${avgScore}%`,
      icon: Mic,
      color: "text-purple-600"
    },
    {
      label: "Open Applications",
      value: "4",
      icon: Rocket,
      color: "text-emerald-600"
    },
    {
      label: "Career Strategy",
      value: "78%",
      icon: Compass,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10">

      {/* Welcome Header */}

      <motion.div
        initial={{opacity:0, y:10}}
        animate={{opacity:1, y:0}}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white rounded-2xl p-8 shadow-xl"
      >

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles size={20}/>
             Good morning, {user?.firstName || "User"}!
            </h1>

            <p className="text-indigo-100 mt-2">
              Your career is trending upward. Let's keep the momentum going.
            </p>

          </div>

          <Target className="opacity-30" size={60} />

        </div>

      </motion.div>


      {/* Stats Ribbon */}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >

        {stats.map((stat, i) => {

          const Icon = stat.icon

          return (

            <motion.div
              key={i}
              variants={item}
              className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >

              <div className="flex items-center justify-between mb-3">

                <Icon className={stat.color} size={20} />

                <span className="text-xs text-zinc-400 uppercase">
                  {stat.label}
                </span>

              </div>

              <p className="text-2xl font-bold text-zinc-900">
                {stat.value}
              </p>

            </motion.div>

          )
        })}

      </motion.div>


      {/* Main Dashboard Area */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recommended Next Steps */}

        <motion.div
          initial={{opacity:0, x:-20}}
          animate={{opacity:1, x:0}}
          className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm"
        >

          <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
            <Brain size={18}/>
            Recommended Next Steps
          </h2>

          <div className="space-y-4">

            {[
              "Enhance your latest resume bullet",
              "Practice a mock interview for Frontend Developer role",
              "Review industry insights for AI/ML careers",
              "Update your career roadmap milestones"
            ].map((task, i) => (

              <div
                key={i}
                className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl hover:bg-zinc-100 transition"
              >

                <p className="text-sm text-zinc-700">
                  {task}
                </p>

                <ArrowRight
                  size={18}
                  className="text-zinc-400"
                />

              </div>

            ))}

          </div>

        </motion.div>


        {/* Quick Tools */}

        <motion.div
          initial={{opacity:0, x:20}}
          animate={{opacity:1, x:0}}
          className="bg-zinc-900 text-white rounded-2xl p-6 shadow-xl"
        >

          <h2 className="font-semibold text-lg mb-5 flex items-center gap-2">
            <Rocket size={18}/>
            Quick Tools
          </h2>

          <div className="space-y-4">

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-xl p-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText size={16}/>
                Bullet Enhancer
              </span>

              <ArrowRight size={16}/>
            </button>

            <button className="w-full bg-purple-600 hover:bg-purple-700 transition text-white rounded-xl p-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Mic size={16}/>
                Mock Interview
              </span>

              <ArrowRight size={16}/>
            </button>

            <button className="w-full bg-emerald-600 hover:bg-emerald-700 transition text-white rounded-xl p-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Compass size={16}/>
                Career Roadmap
              </span>

              <ArrowRight size={16}/>
            </button>

          </div>

        </motion.div>

      </div>

    </div>
  )
}