
import { mnemonicToEntropy, pbkdf2Sha512, PBKDF_ITERATIONS } from './common';


/**
 * @param mnemonicArray    {string[]}
 * @param password? {string}
 * @return {Promise<Uint8Array>}
 */
export async function mnemonicToSeed(mnemonicArray, password = '') {
  const entropy = await mnemonicToEntropy(mnemonicArray, password);
  const seed = await pbkdf2Sha512(entropy, 'TON default seed', PBKDF_ITERATIONS);
  return seed.slice(0, 32);
}
