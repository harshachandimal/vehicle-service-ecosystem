import bcrypt from 'bcryptjs';

/** Number of salt rounds for bcrypt hashing */
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcrypt
 * 
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} The hashed password
 * 
 * @example
 * const hashed = await hashPassword('myPassword123');
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 * 
 * @param {string} password - The plain text password to compare
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 * 
 * @example
 * const isValid = await comparePassword('myPassword123', hashedPassword);
 */
export async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}
