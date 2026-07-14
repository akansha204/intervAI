import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/register',
  body('email').isEmail().withMessage('Must be a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('name')
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),
  validate,
  authController.register,
);

router.post(
  '/login',
  body('email').isEmail().withMessage('Must be a valid email').normalizeEmail(),
  body('password').isString().notEmpty().withMessage('Password is required'),
  validate,
  authController.login,
);

router.post(
  '/refresh',
  body('refreshToken').isString().notEmpty().withMessage('refreshToken is required'),
  validate,
  authController.refresh,
);

router.post(
  '/forgot-password',
  body('email').isEmail().withMessage('Must be a valid email').normalizeEmail(),
  validate,
  authController.forgotPassword,
);

router.post(
  '/reset-password',
  body('email').isEmail().withMessage('Must be a valid email').normalizeEmail(),
  body('otp').isString().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  validate,
  authController.resetPassword,
);

router.get('/profile', authenticate, authController.getProfile);
router.post('/logout', authenticate, authController.logout);

export default router;
