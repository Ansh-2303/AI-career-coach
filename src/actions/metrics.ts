"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function getAverageInterviewScore() {

  const { userId } = await auth()

  if (!userId) return 0

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId
    }
  })

  const sessions = await prisma.interviewSession.findMany({
    where: { userId: user.id }, // FIXED
    select: { score: true }
  })

  if (sessions.length === 0) return 0

  const total = sessions.reduce((sum, s) => sum + (s.score ?? 0), 0)

  return Math.round(total / sessions.length)
}

export async function getResumeStrength() {

  const { userId } = await auth()

  if (!userId) return 0

  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  if (!user) return 0

  const resumes = await prisma.resumeData.findMany({
    where: { userId: user.id }
  })

  if (resumes.length === 0) return 0

  return Math.min(40 + resumes.length * 10, 95)
}

export async function getCareerStrategyScore() {

  const { userId } = await auth()

  if (!userId) return 0

  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  if (!user) return 0

  const roadmaps = await prisma.careerRoadmap.findMany({
    where: { userId: user.id }
  })

  if (roadmaps.length === 0) return 0

  return Math.min(50 + roadmaps.length * 10, 95)
}