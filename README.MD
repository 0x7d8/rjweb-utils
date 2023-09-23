<h1 align="center">Welcome to @rjweb/utils 👋</h1>
<center>
  <a href="https://www.npmjs.com/package/@rjweb/utils" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@rjweb/utils.svg">
  </a>
  <a href="https://github.com/rotvproHD/rjweb-utils#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/rotvproHD/rjweb-utils/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>

  Easy and Lightweight Utilities
</center>

### 🏠 [Homepage](https://github.com/rotvproHD/rjweb-utils#readme)

## Install

```sh
# NPM
npm install @rjweb/utils

# Yarn
yarn add @rjweb/utils

# pNPM
pnpm add @rjweb/utils
```

## Example Usage

Generating a Random Number in Range
```js
const { number } = require('@rjweb/utils')

const min = 50
const max = 100

const result = number.generate(min, max)
```

Generating a Random String
```js
const { string } = require('@rjweb/utils')

const result = string.generate({
  length: 25,
  numbers: true,
  symbols: true,
  uppercase: true,
  lowercase: true
})
```

Encrypting a String
```js
const { string } = require('@rjweb/utils')

const result = string.encrypt('Hello', 'secret', {
  output: 'hex'
})
```

Decrypting a String
```js
const { string } = require('@rjweb/utils')

const result = string.decrypt('df4d0fe46e0210d4ef46368a6c3d56bb', 'secret', {
  input: 'hex'
})
```

Hashing a String
```js
const { string } = require('@rjweb/utils')

const result = string.hash('Hello', {
  salt: 'secret',
  algorithm: 'sha256',
  output: 'hex'
})
```

Check if a Host is reachable
```js
const { network } = require('@rjweb/utils')

// host, port, timeout ms
const result = await network.test('127.0.0.1', 80, 5000)
```

Parsing Options
```js
const { object } = require('@rjweb/utils')

const original = {
  ssl: true,
  maxRequests: 10000,
  other: {
    clock: true,
    date: {
      enabled: true,
      timezone: 'UTC'
    }
  }
}

const userProvided = {
  ssl: false,
  other: {
    date: {
      timezone: 'CET'
    }
  }
}

const result = object.deepParse(original, userProvided)
/**
 * {
 *   ssl: false,
 *   maxRequests: 10000,
 *   other: {
 *     clock: true,
 *     date: {
 *       enabled: true,
 *       timezone: 'CET'
 *     }
 *   }
 * }
*/
```

## Author

👤 **0x7d8**

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/0x7d8/rjweb-utils/issues). 

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2023 [0x7d8](https://github.com/0x7d8).<br />
This project is MIT licensed.