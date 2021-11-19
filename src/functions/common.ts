
import crypto from '../crypto/crypto-node';


export const PBKDF_ITERATIONS = 100000;


/**
 * @private
 * @param entropy   {ArrayBuffer}
 * @return {Promise<boolean>}
 */
export async function isBasicSeed(entropy) {
  const seed = await pbkdf2Sha512(entropy, 'TON seed version', Math.max(1, Math.floor(PBKDF_ITERATIONS / 256)));
  return seed[0] == 0;
}


/**
 * @private
 * @param entropy   {ArrayBuffer}
 * @return {Promise<boolean>}
 */
export async function isPasswordSeed(entropy) {
  const seed = await pbkdf2Sha512(entropy, 'TON fast seed version', 1);
  return seed[0] == 1;
}


/**
 * @private
 * @param mnemonicArray    {string[]}
 * @param password? {string}
 * @return {Promise<ArrayBuffer>}
 */
export async function mnemonicToEntropy(mnemonicArray, password = '') {
  const mnemonicPhrase = mnemonicArray.join(' ');
  return await hmacSha512(mnemonicPhrase, password);
}


/**
 * @private
 * @param key   {ArrayBuffer}
 * @param salt  {string}
 * @param iterations    {number}
 * @return {Promise<Uint8Array>}
 */
export async function pbkdf2Sha512(key, salt, iterations) {
  const saltBuffer = stringToArray(salt).buffer;
  const pbkdf2_key = await crypto.subtle.importKey(
    'raw',
    key,
    {name: 'PBKDF2'},
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {name: 'PBKDF2', hash: 'SHA-512', salt: saltBuffer, iterations: iterations},
    pbkdf2_key,
    512
  );
  return new Uint8Array(derivedBits);
}


async function hmacSha512(phrase, password) {
  /**
   * @private
   * @param phrase  {string}
   * @param password  {string}
   * @return {Promise<ArrayBuffer>}
   */
  const phraseBuffer = stringToArray(phrase).buffer;
  const passwordBuffer = password.length ? stringToArray(password).buffer : new ArrayBuffer(0);
  const hmacAlgo = {name: 'HMAC', hash: 'SHA-512'};
  const hmacKey = await crypto.subtle.importKey(
    'raw',
    phraseBuffer,
    hmacAlgo,
    false,
    ['sign']
  );
  return await crypto.subtle.sign(hmacAlgo, hmacKey, passwordBuffer);
}


/**
 * @private
 * @param str {string}
 * @param size?  {number}
 * @return {Uint8Array}
 */
function stringToArray(str, size = 1) {
  let buf;
  let bufView;

  if (size === 1) {
    buf = new ArrayBuffer(str.length);
    bufView = new Uint8Array(buf);
  }
  if (size === 2) {
    buf = new ArrayBuffer(str.length * 2);
    bufView = new Uint16Array(buf);
  }
  if (size === 4) {
    buf = new ArrayBuffer(str.length * 4);
    bufView = new Uint32Array(buf);
  }
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return new Uint8Array(bufView.buffer);
}
