import { Response } from 'express';
import { AuthRequest } from '../types';
import prisma from '../utils/prisma';
import * as geminiService from '../services/geminiService';
import * as promptService from '../services/promptService';

/**
 * Start a new interview session
 */
export const startSession = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authenticated',
            });
        }

        const { type, company } = req.body;

        if (!type) {
            return res.status(400).json({
                status: 'error',
                message: 'Interview type is required',
            });
        }

        // Create interview session
        const session = await prisma.interviewSession.create({
            data: {
                userId: req.user.id,
                type,
                company: company || null,
                status: 'in-progress',
            },
        });

        // Create user stats if doesn't exist
        await prisma.userStats.upsert({
            where: { userId: req.user.id },
            update: {
                totalSessions: { increment: 1 },
            },
            create: {
                userId: req.user.id,
                totalSessions: 1,
                completedSessions: 0,
                averageScore: 0,
                dailyStreak: 0,
                behavioralScore: 0,
                technicalScore: 0,
                badges: [],
            },
        });

        return res.status(201).json({
            status: 'success',
            message: 'Interview session started',
            data: { session },
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
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
                message: 'Category and difficulty are required',
            });
        }

        // Generate prompt
        const prompt = promptService.generateQuestionPrompt(category, difficulty, topic);

        // Get AI response
        const aiResponse = await geminiService.generateJSONContent<{
            question: string;
            context: string;
            expectedPoints: string[];
        }>(prompt);

        // Save question to database
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
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to generate question',
        });
    }
};

/**
 * Submit answer and get AI feedback
 */
export const submitAnswer = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authenticated',
            });
        }

        const { sessionId } = req.params;
        const { questionId, answer, transcription } = req.body;

        if (!questionId || !answer) {
            return res.status(400).json({
                status: 'error',
                message: 'Question ID and answer are required',
            });
        }

        // Verify session belongs to user
        const session = await prisma.interviewSession.findFirst({
            where: {
                id: sessionId,
                userId: req.user.id,
            },
        });

        if (!session) {
            return res.status(404).json({
                status: 'error',
                message: 'Session not found',
            });
        }

        // Get question
        const question = await prisma.question.findUnique({
            where: { id: questionId },
        });

        if (!question) {
            return res.status(404).json({
                status: 'error',
                message: 'Question not found',
            });
        }

        // Generate AI feedback
        console.log('📝 Generating feedback for answer...');
        console.log('Question:', question.question);
        console.log('Answer:', answer.substring(0, 100) + '...');

        const feedbackPrompt = promptService.generateFeedbackPrompt(question.question, answer);

        let aiFeedback;
        try {
            aiFeedback = await geminiService.generateJSONContent<promptService.FeedbackResponse>(
                feedbackPrompt
            );
            console.log('✅ Feedback generated successfully');
        } catch (feedbackError: any) {
            console.error('❌ Feedback generation failed:', feedbackError.message);
            // Continue with default feedback if AI fails
            aiFeedback = {
                score: 5,
                strengths: ['Answer provided'],
                improvements: ['Unable to generate detailed feedback at this time. Please try again later.'],
                starAnalysis: {
                    situation: 'N/A',
                    task: 'N/A',
                    action: answer.substring(0, 100),
                    result: 'N/A'
                }
            };
        }

        // Save answer
        const savedAnswer = await prisma.answer.create({
            data: {
                sessionId,
                questionId,
                answer,
                transcription: transcription || null,
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
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to submit answer',
        });
    }
};

/**
 * Complete session and generate final feedback
 */
export const completeSession = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authenticated',
            });
        }

        const { sessionId } = req.params;

        // Get session with answers
        const session = await prisma.interviewSession.findFirst({
            where: {
                id: sessionId,
                userId: req.user.id,
            },
            include: {
                answers: true,
            },
        });

        if (!session) {
            return res.status(404).json({
                status: 'error',
                message: 'Session not found',
            });
        }

        // Calculate average score
        const scores = session.answers.map((a: any) => a.score || 0);
        const averageScore = scores.length > 0
            ? scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
            : 0;

        // Update session
        await prisma.interviewSession.update({
            where: { id: sessionId },
            data: {
                status: 'completed',
                score: averageScore,
                completedAt: new Date(),
            },
        });

        // Update user stats
        await prisma.userStats.update({
            where: { userId: req.user.id },
            data: {
                completedSessions: { increment: 1 },
                averageScore: averageScore,
            },
        });

        return res.status(200).json({
            status: 'success',
            message: 'Session completed',
            data: {
                sessionId,
                averageScore,
                totalQuestions: session.answers.length,
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to complete session',
        });
    }
};

/**
 * Get session feedback
 */
export const getSessionFeedback = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Not authenticated',
            });
        }

        const { sessionId } = req.params;

        const session = await prisma.interviewSession.findFirst({
            where: {
                id: sessionId,
                userId: req.user.id,
            },
            include: {
                answers: {
                    include: {
                        question: true,
                    },
                },
            },
        });

        if (!session) {
            return res.status(404).json({
                status: 'error',
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
                answers: session.answers.map((answer: any) => ({
                    id: answer.id,
                    question: answer.question.question,
                    answer: answer.answer,
                    score: answer.score,
                })),
            },
        });
    } catch (error: any) {
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to get feedback',
        });
    }
};
