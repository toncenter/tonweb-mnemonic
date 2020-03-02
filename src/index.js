/**
 * @authors @rulon and @tolyayanot
 */

const nacl = require("tweetnacl");
const wordlists = require("./bip39_wordlists.js").wordlists;
const defaultWordlist = wordlists.EN;

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

/**
 * @private
 */
const PBKDF_ITERATIONS = 100000;

/**
 * @private
 * @param mnemonicArray  {string[]}
 * @return {Uint8Array}
 */
function mnemonicToBuffer(mnemonicArray) {
    return stringToArray(mnemonicArray.join(" "));
}

/**
 * @private
 * @param phrase  {string}
 * @param password  {string}
 * @return {Promise<ArrayBuffer>}
 */
async function hmac_sha512(phrase, password) {
    const phraseBuffer = stringToArray(phrase).buffer;
    const passwordBuffer = password.length ? stringToArray(password).buffer : new ArrayBuffer(0);
    const hmacAlgo = {name: "HMAC", hash: "SHA-512"};
    const hmacKey = await window.crypto.subtle.importKey(
        "raw",
        phraseBuffer,
        hmacAlgo,
        false,
        ["sign"]
    );
    return await crypto.subtle.sign(hmacAlgo, hmacKey, passwordBuffer);
}

/**
 * @private
 * @param key   {ArrayBuffer}
 * @param salt  {string}
 * @param iterations    {number}
 * @return {Promise<Uint8Array>}
 */
async function pbkdf2_sha512(key, salt, iterations) {
    const saltBuffer = stringToArray(salt).buffer;
    const pbkdf2_key = await window.crypto.subtle.importKey(
        "raw",
        key,
        {name: "PBKDF2"},
        false,
        ["deriveBits"]
    );
    const derivedBits = await window.crypto.subtle.deriveBits(
        {name: "PBKDF2", hash: "SHA-512", salt: saltBuffer, iterations: iterations},
        pbkdf2_key,
        512
    );
    return new Uint8Array(derivedBits);
}

/**
 * @private
 * @param entropy   {ArrayBuffer}
 * @return {Promise<boolean>}
 */
async function isBasicSeed(entropy) {
    const seed = await pbkdf2_sha512(entropy, "TON seed version", Math.max(1, Math.floor(PBKDF_ITERATIONS / 256)));
    return seed[0] == 0;
}

/**
 * @private
 * @param entropy   {ArrayBuffer}
 * @return {Promise<boolean>}
 */
async function isPasswordSeed(entropy) {
    const seed = await pbkdf2_sha512(entropy, "TON fast seed version", 1);
    return seed[0] == 1;
}

/**
 * @private
 * @param mnemonicArray    {string[]}
 * @param password? {string}
 * @return {Promise<ArrayBuffer>}
 */
async function mnemonicToEntropy(mnemonicArray, password = "") {
    const mnemonicPhrase = mnemonicArray.join(" ");
    return await hmac_sha512(mnemonicPhrase, password);
}

/**
 * @param mnemonicArray    {string[]}
 * @param password? {string}
 * @param wordlist? {string[]}
 * @return {Promise<boolean>}
 */
async function validateMnemonic(mnemonicArray, password = "", wordlist = defaultWordlist) {
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

/**
 * @param mnemonicArray    {string[]}
 * @return {Promise<boolean>}
 */
async function isPasswordNeeded(mnemonicArray) {
    // password mnemonic (without password) should be password seed, but not basic seed
    const passlessEntropy = await mnemonicToEntropy(mnemonicArray, "");
    return (await isPasswordSeed(passlessEntropy)) && !(await isBasicSeed(passlessEntropy));
}

/**
 * @param mnemonicArray    {string[]}
 * @param password? {string}
 * @return {Promise<Uint8Array>}
 */
async function mnemonicToSeed(mnemonicArray, password = "") {
    const entropy = await mnemonicToEntropy(mnemonicArray, password);
    const seed = await pbkdf2_sha512(entropy, "TON default seed", PBKDF_ITERATIONS);
    return seed.slice(0, 32);
}

/**
 * @param mnemonicArray    {string[]}
 * @param password? {string}
 * @return {Promise<{publicKey:Uint8Array, secretKey:Uint8Array}>} Key pair
 */
async function mnemonicToKeyPair(mnemonicArray, password = "") {
    const seed = (await mnemonicToSeed(mnemonicArray, password));
    return nacl.sign.keyPair.fromSeed(seed);
}

/**
 * @param wordsCount? {number}
 * @param password? {string}
 * @param wordlist? {string[]}
 * @return {Promise<string[]>}
 */
async function generateMnemonic(wordsCount = 24, password = "", wordlist = defaultWordlist) {
    // const start_time = Date.now()
    let c = 0;
    let mnemonicArray = [];
    while (true) {
        c += 1;
        mnemonicArray = [];
        const rnd = window.crypto.getRandomValues(new Uint16Array(wordsCount));
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
    // console.log("Mnemonic generation attempts:", c, "time", Date.now() - start_time);
    return mnemonicArray;
}

exports.generateMnemonic = generateMnemonic;
exports.mnemonicToSeed = mnemonicToSeed;
exports.mnemonicToKeyPair = mnemonicToKeyPair;
exports.validateMnemonic = validateMnemonic;
exports.isPasswordNeeded = isPasswordNeeded;
exports.wordlists = wordlists;