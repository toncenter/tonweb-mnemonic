
import { mnemonicToEntropy, pbkdf2Sha512, PBKDF_ITERATIONS } from './common';


export async function mnemonicToSeed(
  mnemonicArray: string[],
  password = ''

): Promise<Uint8Array> {

  const entropy = await mnemonicToEntropy(mnemonicArray, password);

  const seed = await pbkdf2Sha512(entropy, 'TON default seed', PBKDF_ITERATIONS);

  return seed.slice(0, 32);

}
