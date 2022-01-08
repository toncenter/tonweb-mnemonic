
import crypto from '../crypto/crypto-node';


export const PBKDF_ITERATIONS = 100000;


export async function isBasicSeed(entropy: ArrayBuffer): Promise<boolean> {
  const seed = await pbkdf2Sha512(entropy, 'TON seed version', Math.max(1, Math.floor(PBKDF_ITERATIONS / 256)));
  return seed[0] == 0;
}


export async function isPasswordSeed(entropy: ArrayBuffer): Promise<boolean> {
  const seed = await pbkdf2Sha512(entropy, 'TON fast seed version', 1);
  return seed[0] == 1;
}


export async function mnemonicToEntropy(mnemonicArray: string[], password: string = ''): Promise<ArrayBuffer> {
  const mnemonicPhrase = mnemonicArray.join(' ');
  return await hmacSha512(mnemonicPhrase, password);
}


export async function pbkdf2Sha512(key: ArrayBuffer, salt: string, iterations: number): Promise<Uint8Array> {
  const saltBuffer = stringToIntArray(salt).buffer;
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


export async function hmacSha512(phrase: string, password: string): Promise<ArrayBuffer> {
  const phraseBuffer = stringToIntArray(phrase).buffer;
  const passwordBuffer = password.length ? stringToIntArray(password).buffer : new ArrayBuffer(0);
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


export function stringToIntArray(str: string, size: number = 1): Uint8Array {

  let buffer;
  let bufferView;

  switch (size) {
    case 1:
      buffer = new ArrayBuffer(str.length);
      bufferView = new Uint8Array(buffer);
      break;
    case 2:
      buffer = new ArrayBuffer(str.length * 2);
      bufferView = new Uint16Array(buffer);
      break;
    case 4:
      buffer = new ArrayBuffer(str.length * 4);
      bufferView = new Uint32Array(buffer);
      break;
    default:
      throw new Error(`Incorrect size specified: ${size}`);
  }

  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufferView[i] = str.charCodeAt(i);
  }

  return new Uint8Array(bufferView.buffer);

}
