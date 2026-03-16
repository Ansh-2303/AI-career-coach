"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Sparkles, FileText, Target } from "lucide-react"

import ResumeEnhancer from "@/components/shared/ResumeEnhancer"
import CoverLetterGenerator from "@/components/shared/CoverLetterGenerator"
// 1. Swap the old matcher for the new Heavy ATS Matcher
import ResumeATSMatcher from "@/components/shared/ResumeATSMatcher"

export default function ResumeStudio() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="text-indigo-600"/>
          Resume Studio
        </h1>
        <p className="text-zinc-500 mt-2">
          Your AI creative suite for job applications
        </p>
      </div>

      <Tabs defaultValue="enhancer" className="w-full">
        {/* Tab Navigation */}
        <TabsList className="grid grid-cols-3 bg-zinc-100 p-1 rounded-xl mb-8">
          <TabsTrigger value="enhancer" className="flex gap-2 items-center">
            <Sparkles size={16}/>
            Bullet Enhancer
          </TabsTrigger>
          <TabsTrigger value="cover" className="flex gap-2 items-center">
            <FileText size={16}/>
            Cover Letter
          </TabsTrigger>
          <TabsTrigger value="ats" className="flex gap-2 items-center">
            <Target size={16}/>
            ATS Matcher
          </TabsTrigger>
        </TabsList>

        {/* Bullet Enhancer */}
        <TabsContent value="enhancer">
          <motion.div
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.3}}
            className="bg-white/80 backdrop-blur-md border border-zinc-200 rounded-2xl p-6 shadow-lg"
          >
            <ResumeEnhancer />
          </motion.div>
        </TabsContent>

        {/* Cover Letter */}
        <TabsContent value="cover">
          <motion.div
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.3}}
            className="bg-white/80 backdrop-blur-md border border-zinc-200 rounded-2xl p-6 shadow-lg"
          >
            <CoverLetterGenerator />
          </motion.div>
        </TabsContent>

        {/* ATS Matcher */}
        <TabsContent value="ats">
          <motion.div
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.3}}
            className="bg-white/80 backdrop-blur-md border border-zinc-200 rounded-2xl p-6 shadow-lg"
          >
            {/* 2. Mount the new heavy component here */}
            <ResumeATSMatcher />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}