
import nacl from 'tweetnacl';

import { mnemonicToSeed } from './mnemonic-to-seed';


/**
 * @param mnemonicArray    {string[]}
 * @param password? {string}
 * @return {Promise<{publicKey:Uint8Array, secretKey:Uint8Array}>} Key pair
 */
export async function mnemonicToKeyPair(mnemonicArray, password = '') {
  const seed = (await mnemonicToSeed(mnemonicArray, password));
  return nacl.sign.keyPair.fromSeed(seed);
}
