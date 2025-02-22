import bcrypt from 'bcrypt';

const SALT_ROUNDS = 6; 

export async function hashPassword(password) {
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        return hashedPassword; 
    } catch (err) {
        console.error('Error hashing password:', err);
    }
}

export async function verifyPassword(storedHash, password) {
    try {
        const match = await bcrypt.compare(password, storedHash);
        return match; 
    } catch (err) {
        console.error('Error verifying password:', err);
    }
}