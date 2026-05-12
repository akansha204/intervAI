import {
    isValidEmail,
    isValidPassword,
    isValidName,
    sanitizeEmail,
    sanitizeName,
} from '../utils/validators';

describe('isValidEmail', () => {
    it.each([
        ['user@example.com', true],
        ['anmol+test@withinstafix.com', true],
        ['not-an-email', false],
        ['missing@tld', false],
        ['@no-local.com', false],
        ['', false],
    ])('isValidEmail(%j) === %s', (input, expected) => {
        expect(isValidEmail(input)).toBe(expected);
    });
});

describe('isValidPassword', () => {
    it('accepts a strong password', () => {
        expect(isValidPassword('Secret#1abc').valid).toBe(true);
    });

    it.each([
        ['short1!', /at least 8/i],
        ['lowercase1!', /uppercase/i],
        ['UPPERCASE1!', /lowercase/i],
        ['NoNumber!', /number/i],
        ['NoSpecial1', /special/i],
    ])('rejects %j with reason %s', (input, expected) => {
        const result = isValidPassword(input);
        expect(result.valid).toBe(false);
        expect(result.message).toMatch(expected);
    });
});

describe('isValidName', () => {
    it('accepts a normal name', () => {
        expect(isValidName('Anmol Singh').valid).toBe(true);
    });

    it('rejects single-character names', () => {
        expect(isValidName('A').valid).toBe(false);
    });

    it('rejects names with digits', () => {
        const result = isValidName('Anmol1');
        expect(result.valid).toBe(false);
    });

    it('rejects names over 50 characters', () => {
        expect(isValidName('a'.repeat(51)).valid).toBe(false);
    });
});

describe('sanitizers', () => {
    it('sanitizeEmail lowercases and trims', () => {
        expect(sanitizeEmail('  Foo@Bar.com  ')).toBe('foo@bar.com');
    });

    it('sanitizeName collapses internal whitespace and trims', () => {
        expect(sanitizeName('  Anmol   Singh  ')).toBe('Anmol Singh');
    });
});
