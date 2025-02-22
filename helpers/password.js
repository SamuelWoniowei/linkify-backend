import argon2 from 'argon2';

export async function hashPassword(password) {
    try {
      const hashedPassword = await argon2.hash(password);
      return hashedPassword; 
    } catch (err) {
      console.error('Error hashing password:', err);
    }
}

export async function verifyPassword(storedHash, password) {
    try {
      const match = await argon2.verify(storedHash, password);
      return match; 
    } catch (err) {
      console.error('Error verifying password:', err);
    }
}
