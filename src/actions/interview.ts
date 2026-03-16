"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export async function saveInterviewSession(data: {
  role: string
  questions: any
  answers: any
  score: number
  feedback?: string
}) {

  const { userId } = await auth()

  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: { clerkId: userId }
  })

  return prisma.interviewSession.create({
    data: {
      userId: user.id,
      role: data.role,
      questions: data.questions,
      answers: data.answers,
      score: data.score,
      feedback: data.feedback
    }
  })
}