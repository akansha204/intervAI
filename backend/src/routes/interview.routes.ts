import { Router } from 'express';
import * as interviewController from '../controllers/interviewController';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All interview routes require authentication
router.use(authenticate);

// Dashboard
router.get('/dashboard', interviewController.getDashboard);

// Session management
router.post('/start', interviewController.startSession);
router.post('/:sessionId/complete', interviewController.completeSession);
router.get('/:sessionId/feedback', interviewController.getSessionFeedback);

// Question and answer
router.post('/question/generate', interviewController.generateQuestion);
router.post('/:sessionId/answer', interviewController.submitAnswer);

export default router;
