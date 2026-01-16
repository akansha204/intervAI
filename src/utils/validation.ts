/**
 * Validate email format
 */
export const validateEmail = (email: string): { valid: boolean; message?: string } => {
    if (!email) {
        return { valid: false, message: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Invalid email format' };
    }

    return { valid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (!password) {
        return { valid: false, message: 'Password is required' };
    }

    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' };
    }

    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain an uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain a lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain a number' };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, message: 'Password must contain a special character' };
    }

    return { valid: true };
};

/**
 * Validate name
 */
export const validateName = (name: string): { valid: boolean; message?: string } => {
    if (!name) {
        return { valid: false, message: 'Name is required' };
    }

    if (name.length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters' };
    }

    if (name.length > 50) {
        return { valid: false, message: 'Name must not exceed 50 characters' };
    }

    return { valid: true };
};

/**
 * Validate passwords match
 */
export const validatePasswordsMatch = (
    password: string,
    confirmPassword: string
): { valid: boolean; message?: string } => {
    if (password !== confirmPassword) {
        return { valid: false, message: 'Passwords do not match' };
    }

    return { valid: true };
};
