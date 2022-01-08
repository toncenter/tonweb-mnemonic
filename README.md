
# tonweb-mnemonic

[![NPM](https://img.shields.io/npm/v/tonweb-mnemonic.svg)](https://www.npmjs.org/package/tonweb-mnemonic)

Mnemonic code for generating deterministic keys for TON blockchain.


## Features

- library interface is similar to the library `bitcoinjs/bip39`
  (mnemonic for Bitcoin),
- there is only one dependency: `tweetnacl`,
- supports both Browser (UMD) and Node.js (>=15, CommonJS)
- written in TypeScript and provides typing declarations


## Install

`npm install --save tonweb-mnemonic`


## Usage in browser

```html
`<script src="libs/tonweb.js"></script>`
`<script src="libs/tonweb-mnemonic.js"></script>`

<script type="application/javascript">
    // mnemonic is set to window.TonWeb object if it exists:
    const tonMnemonic = window.TonWeb.mnemonic;    
</script>
```


## Usage in Node.js

```js
import tonMnemonic from "tonweb-mnemonic";

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


## Contributing

We will gladly accept any useful contributions.


### TO DO:

- write tests for all functions (improve tests coverage)
- implement tests execution on all OSes in Node
- implement tests execution in Browser (i.e. headless Chrome)


### Development guide

`npm install` — to install dependencies

`npm run build` — to make a *development* build

`npm run build:ci` — to make a *production* build

`npm run test:manual` — to run manual tests in the browser


## Contributors

- [rulon](https://github.com/rulon)
- [tolya-yanot](https://github.com/tolya-yanot)
- [Slava Fomin II](https://github.com/slavafomin)
