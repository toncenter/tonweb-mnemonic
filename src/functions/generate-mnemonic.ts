
import crypto from '../crypto/crypto-node';
import { default as defaultWordlist } from '../bip39-wordlists';
import { isBasicSeed, mnemonicToEntropy } from './common';
import { isPasswordNeeded } from './is-password-needed';


export async function generateMnemonic(
  wordsCount = 24,
  password = '',
  wordlist = defaultWordlist

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
    if (!(await isBasicSeed(await mnemonicToEntropy(mnemonicArray, password)))) {
      continue;
    }
    break;
  }

  return mnemonicArray;

}
