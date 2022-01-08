
import nacl from 'tweetnacl';

import { mnemonicToSeed } from './mnemonic-to-seed';


export interface KeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}


export async function mnemonicToKeyPair(mnemonicArray: string[], password = ''): Promise<KeyPair> {
  const seed = (await mnemonicToSeed(mnemonicArray, password));
  return nacl.sign.keyPair.fromSeed(seed);
}
