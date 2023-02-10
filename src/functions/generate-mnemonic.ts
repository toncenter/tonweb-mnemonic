
import crypto from '../crypto/crypto-node';
import { default as defaultWordlist } from '../bip39-wordlists';
import { isBasicSeed, isPasswordSeed, mnemonicToEntropy } from './common';
import { isPasswordNeeded } from './is-password-needed';


export async function generateMnemonic(
  wordsCount: number = 24,
  password: string = '',
  wordlist: string[] = defaultWordlist

): Promise<string[]> {

  let c = 0;
  let mnemonicArray = [];

  while (true) {
    c += 1;
    mnemonicArray = [];
    const rnd = crypto.getRandomValues(new Uint16Array(wordsCount));
    for (let i = 0; i < wordsCount; i++) {
      mnemonicArray.push(wordlist[rnd[i] & 2047]); // We loose 5 out of 16 bits of entropy here, good enough
    }
    if (password.length > 0) {
      if (!await isPasswordNeeded(mnemonicArray))
        continue;
    }
    const entropy = await mnemonicToEntropy(mnemonicArray, password)
    const isBasicSeedPromise = isBasicSeed(entropy)
    const isPasswordSeedPromise = isPasswordSeed(entropy)
    if (!(await isBasicSeedPromise) || (await isPasswordSeedPromise)) {
      continue;
    }
    break;
  }

  return mnemonicArray;

}
