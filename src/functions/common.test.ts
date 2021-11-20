
import { TextEncoder } from 'util';

import { hmacSha512, pbkdf2Sha512, stringToIntArray } from './common';


describe('isBasicSeed()', () => {
  it.todo('should work');
});

describe('isPasswordSeed()', () => {
  it.todo('should work');
});

describe('mnemonicToEntropy()', () => {
  it.todo('should work');
});

describe('pbkdf2Sha512()', () => {

  const cases: Array<[string, string, number, string]> = [
    ['tutturu', 'blabla', 10, '3817ff5ce29ec89db7a591b3ec8b053088731a7c967665b6dac9203bc1d75674800a2846c17b6e417269d787cff0b5c23aba5aab6e76ffde441633db1f2bf87b'],
    ['gizmodo_lopez', 'hashimoto', 1000, '308f90aab4434b62e13ff593b5472ee8ae3672e82fe08dfe48a0a6625a9d20304134186cf9889c8b8f135a0f9d5392ed0875fcd1e50c53d54b72dc3001f48377'],
  ];

  for (const [key, salt, iterations, expectedHex] of cases) {
    it(`should generate correct key (${key}/${salt}/${iterations})`, async () => {
      const keyBuffer = stringToIntArray(key);
      const result = await pbkdf2Sha512(keyBuffer, salt, iterations);
      expect(bufferToHex(result.buffer)).toEqual(expectedHex);
    });
  }

});

describe('hmacSha512()', () => {

  const cases = [
    ['mustafa', 'carrot', '651df9349efe6bd60e33ab842eed03ca5816e0248982af6cfb42db5af28beb204524cf96e33d405cecb3c9e05a6ebf23635bc32591b828bd26e673995d511d06'],
    ['gimmler', 'witcher', '17389339d22f8554f4ab07d30cede0c67079c55ae9dee19709f3b4ac4a9d9b380016f76da860d3b4757cbe9dc8c0ceeda07c42fd4fb673414c3af458cd1c3eb0'],
    ['1', '', '70cf5c654a3335e493c263498b849b1aa425012914f8b5e77f4b7b7408ad207db9758f7c431887aa8f4885097e3bc032ee78238157c2ad43e900b69c60aee71e'],
  ];

  for (const [phrase, password, expectedHex] of cases) {
    it(`should generate correct HMAC (${phrase}/${password || '""'})`, async () => {
      const buffer = await hmacSha512(phrase, password);
      expect(bufferToHex(buffer)).toEqual(expectedHex);
    });
  }

});

describe('stringToBuffer()', () => {

  it('should convert string to buffer', () => {

    const buffer = stringToIntArray('hello');

    const expected = (new TextEncoder()).encode('hello');

    expect(buffer).toEqual(expected);

  });

  it('should throw when incorrect size specified', () => {
    expect(() => stringToIntArray('hello', 5))
      .toThrow('Incorrect size');

    expect(() => stringToIntArray('hello', 0))
      .toThrow('Incorrect size');

    expect(() => stringToIntArray('hello', -5))
      .toThrow('Incorrect size');

  });

});


/**
 * Take from: https://stackoverflow.com/a/40031979/1056679
 */
function bufferToHex(buffer) {
  return ([...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
  );
}
