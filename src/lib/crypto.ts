import CryptoJS from "crypto-js";

// Use an environment variable for the secret key.
// In a real app, this MUST be a strong, 32-character string.
const SECRET_KEY = process.env.ENCRYPTION_KEY || "default-secret-key-32-chars-long!!";

/**
 * Encrypts a plain text string using AES-256.
 * @param text The text to encrypt
 * @returns The encrypted ciphertext
 */
export const encrypt = (text: string): string => {
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return text; // Return original on failure (fallback, though not ideal for security)
  }
};

/**
 * Decrypts a ciphertext string using AES-256.
 * @param ciphertext The encrypted text to decrypt
 * @returns The decrypted plain text
 */
export const decrypt = (ciphertext: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || ciphertext; // Return original if decryption fails or result is empty
  } catch (error) {
    console.error("Decryption error:", error);
    return ciphertext;
  }
};
