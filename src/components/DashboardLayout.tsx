"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  FileText,
  Video,
  Compass
} from "lucide-react"
import { UserButton } from "@clerk/nextjs"

type Tab = "overview" | "resume" | "interview" | "career"

interface DashboardLayoutProps {
  overview: React.ReactNode
  resume: React.ReactNode
  interview: React.ReactNode
  career: React.ReactNode
}

export default function DashboardLayout({
  overview,
  resume,
  interview,
  career
}: DashboardLayoutProps) {

  const [activeTab, setActiveTab] = useState<Tab>("overview")

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "resume", label: "Resume Studio", icon: FileText },
    { id: "interview", label: "Interview Coach", icon: Video },
    { id: "career", label: "Career Strategy", icon: Compass }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return overview
      case "resume":
        return resume
      case "interview":
        return interview
      case "career":
        return career
    }
  }

  return (
    <div className="flex h-screen bg-zinc-50">

      {/* Sidebar */}

      <aside className="w-64 bg-zinc-950 text-white flex flex-col">

        {/* Logo */}

        <div className="h-16 flex items-center px-6 text-xl font-bold border-b border-zinc-800">
          Coach.ai
        </div>

        {/* Menu */}

        <nav className="flex flex-col gap-2 p-4">

          {tabs.map((tab) => {

            const Icon = tab.icon
            const active = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${
                  active
                    ? "bg-indigo-600"
                    : "hover:bg-zinc-800"
                }`}
              >

                <Icon size={20} />

                {tab.label}

              </button>
            )
          })}

        </nav>

      </aside>


      {/* Main Area */}

      <div className="flex-1 flex flex-col">

        {/* Top Header */}

        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0">

          <h1 className="text-lg font-semibold capitalize">
            {activeTab.replace("-", " ")}
          </h1>

<UserButton />

        </header>


        {/* Content */}

        <main className="p-8 overflow-y-auto">

          <AnimatePresence mode="wait">

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >

              {renderContent()}

            </motion.div>

          </AnimatePresence>

        </main>

      </div>

    </div>
  )
}

