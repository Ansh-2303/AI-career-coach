"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function getAverageInterviewScore() {

  const { userId } = await auth()

  if (!userId) return 0

  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  if (!user) return 0

  const sessions = await prisma.interviewSession.findMany({
    where: { userId: user.id }
  })

  if (sessions.length === 0) return 0

  const total = sessions.reduce((sum, s) => sum + s.score, 0)

  return Math.round(total / sessions.length)
}