# tonweb-mnemonic

Mnemonic code for generating deterministic keys for TON (Telegram Open Network).

Library interface is similar to the library bitcoinjs/bip39 (mnemonic for Bitcoin).

There is only one dependency: tweetnacl.

This is browser library, NodeJS support will be soon.

## Install

`npm install tonweb-mnemonic`

## Example

```
import tonMnemonic from "tonweb-mnemonic"

async function example() {
    tonMnemonic.wordlists.EN;
    // -> array of all words

    const mnemonic = await tonMnemonic.generateMnemonic();
    // -> ["vintage", "nice", "initial", ... ]  24 words by default

    await tonMnemonic.validateMnemonic(mnemonic);
    // -> true

    await tonMnemonic.isPasswordNeeded(mnemonic);
    // -> false

    await tonMnemonic.mnemonicToSeed(mnemonic);
    // -> Uint8Array(32) [183, 90, 187, 181, .. ]

    const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic);
    // -> {publicKey: Uint8Array(32), secretKey: Uint8Array(64)}

    toHexString(keyPair.publicKey);
    // -> "8c8dfc9f9f58badd76151775ff0699bb2498939f669eaef2de16f95a52888c65"

    toHexString(keyPair.secretKey);
    // -> "b75abbb599feed077c8e11cc8cadecfce4945a7869a56d3d38b59cce057a3e0f8c8dfc9f9f58badd76151775ff0699bb2498939f669eaef2de16f95a52888c65"
}

function toHexString(byteArray) {
    return Array.prototype.map.call(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}
```

## Build

`npm install`

`npx webpack --mode=none`

## Authors

@rulon and @tolyayanot