import { Response } from 'express';
import { AuthRequest } from '../types';
import prisma from '../utils/prisma';
import { logger } from '../utils/logger';
import * as geminiService from '../services/geminiService';
import * as promptService from '../services/promptService';

const requireUserId = (req: AuthRequest, res: Response): string | null => {
  if (!req.user) {
    res
      .status(401)
      .json({ status: 'error', code: 'UNAUTHORIZED', message: 'Not authenticated' });
    return null;
  }
  return req.user.id;
};

/**
 * Start a new interview session. Session + UserStats are created in one transaction.
 */
export const startSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const { type, company } = req.body;

    if (!type) {
      return res.status(400).json({
        status: 'error',
        code: 'BAD_REQUEST',
        message: 'Interview type is required',
      });
    }

    const session = await prisma.$transaction(async tx => {
      const newSession = await tx.interviewSession.create({
        data: {
          userId,
          type,
          company: company ?? null,
          status: 'in-progress',
        },
      });

      await tx.userStats.upsert({
        where: { userId },
        update: { totalSessions: { increment: 1 } },
        create: {
          userId,
          totalSessions: 1,
          completedSessions: 0,
          averageScore: 0,
          dailyStreak: 0,
          behavioralScore: 0,
          technicalScore: 0,
          badges: [],
        },
      });

      return newSession;
    });

    return res.status(201).json({
      status: 'success',
      message: 'Interview session started',
      data: { session },
    });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to start interview session');
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: error.message || 'Failed to start session',
    });
  }
};

/**
 * Generate AI interview question
 */
export const generateQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { category, difficulty, topic } = req.body;

    if (!category || !difficulty) {
      return res.status(400).json({
        status: 'error',
        code: 'BAD_REQUEST',
        message: 'Category and difficulty are required',
      });
    }

    const prompt = promptService.generateQuestionPrompt(category, difficulty, topic);

    const aiResponse = await geminiService.generateJSONContent<{
      question: string;
      context: string;
      expectedPoints: string[];
    }>(prompt);

    const question = await prisma.question.create({
      data: {
        category,
        difficulty,
        question: aiResponse.question,
        tags: topic ? [topic] : [],
      },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        question: {
          id: question.id,
          text: aiResponse.question,
          context: aiResponse.context,
          category,
          difficulty,
        },
      },
    });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to generate question');
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: error.message || 'Failed to generate question',
    });
  }
};

/**
 * Submit answer and get AI feedback
 */
export const submitAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const { sessionId } = req.params;
    const { questionId, answer, transcription } = req.body;

    if (!questionId || !answer) {
      return res.status(400).json({
        status: 'error',
        code: 'BAD_REQUEST',
        message: 'Question ID and answer are required',
      });
    }

    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'Session not found',
      });
    }

    const question = await prisma.question.findUnique({ where: { id: questionId } });

    if (!question) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'Question not found',
      });
    }

    logger.debug({ sessionId, questionId }, 'Generating feedback for answer');
    const feedbackPrompt = promptService.generateFeedbackPrompt(question.question, answer);

    let aiFeedback;
    try {
      aiFeedback =
        await geminiService.generateJSONContent<promptService.FeedbackResponse>(feedbackPrompt);
    } catch (feedbackError: any) {
      logger.error(
        { err: feedbackError, sessionId, questionId },
        'Feedback generation failed; using fallback',
      );
      aiFeedback = {
        score: 5,
        strengths: ['Answer provided'],
        improvements: [
          'Unable to generate detailed feedback at this time. Please try again later.',
        ],
        starAnalysis: {
          situation: 'N/A',
          task: 'N/A',
          action: answer.substring(0, 100),
          result: 'N/A',
        },
      };
    }

    const savedAnswer = await prisma.answer.create({
      data: {
        sessionId,
        questionId,
        answer,
        transcription: transcription ?? null,
        score: aiFeedback.score,
      },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        answerId: savedAnswer.id,
        feedback: {
          score: aiFeedback.score,
          strengths: aiFeedback.strengths,
          improvements: aiFeedback.improvements,
          starAnalysis: aiFeedback.starAnalysis,
        },
      },
    });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to submit answer');
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: error.message || 'Failed to submit answer',
    });
  }
};

/**
 * Complete session and update user stats. Both writes happen in one transaction.
 */
export const completeSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const { sessionId } = req.params;

    const result = await prisma.$transaction(async tx => {
      const session = await tx.interviewSession.findFirst({
        where: { id: sessionId, userId },
        include: { answers: true },
      });

      if (!session) return null;

      const scores = session.answers.map(a => a.score ?? 0);
      const averageScore =
        scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

      await tx.interviewSession.update({
        where: { id: sessionId },
        data: {
          status: 'completed',
          score: averageScore,
          completedAt: new Date(),
        },
      });

      await tx.userStats.update({
        where: { userId },
        data: {
          completedSessions: { increment: 1 },
          averageScore,
        },
      });

      return { averageScore, totalQuestions: session.answers.length };
    });

    if (!result) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'Session not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Session completed',
      data: { sessionId, ...result },
    });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to complete session');
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: error.message || 'Failed to complete session',
    });
  }
};

/**
 * Get dashboard data: user stats + recent sessions
 */
export const getDashboard = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authenticated',
            });
        }

        const [stats, recentSessions] = await Promise.all([
            prisma.userStats.findUnique({ where: { userId: req.user.id } }),
            prisma.interviewSession.findMany({
                where: { userId: req.user.id },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { answers: true },
            }),
        ]);

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const completedToday = await prisma.interviewSession.count({
            where: {
                userId: req.user.id,
                status: 'completed',
                completedAt: { gte: startOfToday },
            },
        });

        return res.status(200).json({
            status: 'success',
            data: {
                stats: {
                    totalSessions: stats?.totalSessions || 0,
                    averageScore: stats?.averageScore || 0,
                    dailyStreak: stats?.dailyStreak || 0,
                    completedToday,
                },
                recentSessions: recentSessions.map((session: any) => ({
                    id: session.id,
                    type: session.type,
                    score: session.score,
                    date: session.createdAt,
                    questionsCount: session.answers.length,
                })),
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to get dashboard data',
        });
    }
};

/**
 * Get session feedback
 */
export const getSessionFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const { sessionId } = req.params;

    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
      include: { answers: { include: { question: true } } },
    });

    if (!session) {
      return res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: 'Session not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        session: {
          id: session.id,
          type: session.type,
          score: session.score,
          status: session.status,
          createdAt: session.createdAt,
          completedAt: session.completedAt,
        },
        answers: session.answers.map(answer => ({
          id: answer.id,
          question: answer.question.question,
          answer: answer.answer,
          score: answer.score,
        })),
      },
    });
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to get feedback');
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_ERROR',
      message: error.message || 'Failed to get feedback',
    });
  }
};
