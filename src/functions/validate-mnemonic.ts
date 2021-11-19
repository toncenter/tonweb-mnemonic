
import { default as defaultWordlist } from '../bip39-wordlists';
import { isBasicSeed, mnemonicToEntropy } from './common';
import { isPasswordNeeded } from './is-password-needed';


export async function validateMnemonic(
  mnemonicArray: string[],
  password = '',
  wordlist = defaultWordlist

): Promise<boolean> {

  for (let word of mnemonicArray) {
    if (wordlist.indexOf(word) < 0) {
      return false;
    }
  }

  if (password.length > 0) {
    if (!await isPasswordNeeded(mnemonicArray)) {
      return false;
    }
  }

  return await isBasicSeed(
    await mnemonicToEntropy(mnemonicArray, password)
  );

}
