
import { default as defaultWordlist } from '../bip39-wordlists';
import { isBasicSeed, mnemonicToEntropy } from './common';
import { isPasswordNeeded } from './is-password-needed';


/**
 * @param mnemonicArray    {string[]}
 * @param password? {string}
 * @param wordlist? {string[]}
 * @return {Promise<boolean>}
 */
export async function validateMnemonic(mnemonicArray, password = '', wordlist = defaultWordlist) {
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
  return await isBasicSeed(await mnemonicToEntropy(mnemonicArray, password));
}
