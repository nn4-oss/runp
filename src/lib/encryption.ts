import "server-only";
import crypto from "crypto";

/**
 * Symetric Encryption refers to the single key used for both encryption and decryption.
 * Asymetric Encryption would typically use a pair of keys, a public and a private key.
 *
 * The Symetric Encryption implementation is arbitrary and can be challenged.
 *
 * Using the Advanced Encryption Standard is an arbitrary choice and can be challenged
 * The key must be at least 32 bytes to work properly.
 */

const ENCRYPTION_ALGORITHM = "aes-256-cbc";
const DELIMITER = ":";

export const symetricEncryption = (data: string) => {
  // Get and validate the encyption key from the env variables
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("Undefined Encryption key");

  /**
   * Without initialization vectors, each encypted key of a same value would be the same,
   * resulting to a predictable pattern and security breaches.
   */
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ENCRYPTION_ALGORITHM,
    Buffer.from(key, "hex"),
    iv,
  ); // Methods used to encrypt data.

  /**
   * In (very) simple terms, encyption in Node works in chunks, for short strings, it would potentially
   * be encryption in a single itteration, for longer strings to encrypt, the algorithm
   * will process the input as blocks, for instance:
   *
   * alongstringtoencrypt123 -> alon gstr ingt oenc rypt1 23
   *
   * If there are leftover characters, such as "1" in this example, those remaining blocks are processed using the cipher.final() method.
   * The purpose of Buffer.concat is to take the encrypted chunks and potential leftovers chunks and concatenate it to form a single string
   *
   * https://nodejs.org/api/crypto.html
   */
  let encyptedData = cipher.update(data);
  encyptedData = Buffer.concat([encyptedData, cipher.final()]);

  // Decrypt the value and return it with  ":" used a a Delimiter
  return `${iv.toString("hex")}${DELIMITER}${encyptedData.toString("hex")}`;
};

export const symetricDecryption = (encrypted: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("Undefined Encryption key");

  const parts = encrypted.split(DELIMITER);
  const iv = Buffer.from(parts.shift() as string, "hex"); // shift is used to remove the first item and returns it
  const encryptedData = Buffer.from(parts.join(DELIMITER), "hex");
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    Buffer.from(key, "hex"),
    iv,
  );

  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
