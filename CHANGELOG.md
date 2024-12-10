# Changelog

## 1.12.27

- Add `number.toRadians`
- Add `number.toDegrees`
- Add `number.cos`
- Add `number.acos`
- Add `number.sin`
- Add `number.asin`
- Add `number.tan`
- Add `number.atan`

## 1.12.26

- Make sure hex ips have to be fully hex

## 1.12.25

- Add support for hex notation in `network.IPAddress`
- Add `network.IPAddress.hex`
- Add `network.IPAddress.reverse`

## 1.12.24

- Properly error on `filesystem.env`

## 1.12.23

- Add more default jsdocs
- Add `<IPAddress>.toString`
- Add `<Subnet>.toString`

## 1.12.22

- Add `number.fraction`

## 1.12.21

- Fix `dns.resolve` issue when using `fetch` mode

## 1.12.20

- Add `filesystem.replace`
- Add `object.order`
- Improve `string.env` speed

## 1.12.19

- Improve `number.fibonacci` speed
- Add `string.kv`

## 1.12.18

- Improve `number.factorial` speed
- Improve `number.fibonacci` speed
- Add `number.reduce`
- Add `array.median`
- Add `array.mode`

## 1.12.17

- Add `number.factorial`
- Add `number.between`
- Add `number.prime`
- Add `number.fibonacci`
- Add `number.triangle`
- Add `number.factors`
- Add `number.gcd`
- Add `number.lcm`
- Add `number.power`

## 1.12.16

- Add `network.hash`

## 1.12.15

- Add `object.pick`

## 1.12.14

- Fix import issue

## 1.12.13

- Add `filesystem.size`

## 1.12.12

- Add `array.randomizeCrypto`
- Add `array.randomCrypto`
- Add `@supports` to jsdocs
- Rewrite some functions for wider support
- Improve performance of some utils

## 1.12.11

- Increase `maxBuffer` for `system.execute`
- Allow timeout in `system.execute`

## 1.12.10

- Add `string.similarity`
- Add `number.generateCrypto`
- Add `number.clamp`
- Add dns & reverse dns over https

## 1.12.9

- Allow floating point numbers in `time.parse`

## 1.12.8

- Add `time.parse`
- Fix a broken JSDoc

## 1.12.7

- Add `object.deepMerge`
- Add `UnionToIntersection<T>`

## 1.12.6

- Redesign Typedocs
- Add `PromiseOrNot<T>`
- Improve Readme

## 1.12.5

- Bun bypass

## 1.12.4

- Set `filesystem.walk` dirent path manually

## 1.12.3

- Add `filesystem.walk`

## 1.12.2

- Fix RangeErrors when using `network.download`

## 1.12.1

- Allow creating multiple different hashes for the same input in a single call

## 1.12.0

- Add `filesystem.hash`
- Allow `filesystem.env` to be sync
- Update JSDocs

## 1.11.4

- Make subnet parser fix the initial ip
- Rename `<Subnet>.mask` to `<Subnet>.subnetmask`

## 1.11.3

- Fix Queue issues

## 1.11.2

- Fix Subnet validation issues
- Change some IP Parsing

## 1.11.1

- Fix some `array` issues

## 1.11.0

- Fix some Subnet calculations
- Add `<Subnet>.includes`
- Add `<Subnet>.mask`
- Rename `<Subnet>.mask` to `<Subnet>.netmask`
- Fix JSDoc Issues

## 1.10.6

- Change how error handling works in `dns.*`

## 1.10.5

- Rename `dns.resolveHost` to `dns.resolve`
- Add `dns.reverse`

## 1.10.4

- Add `string.env`
- Add `filesystem.env`

## 1.10.3

- Fix more DNS Resolving issues

## 1.10.2

- Improve `dns.resolveHost`
- Fix some IPv6 parsing issues

## 1.10.1

- Export `func` properly

## 1.10.0

- Add `func`
- Fix some JSDocs

## 1.9.3

- Dont require `network.stream` itself to be awaited
- Add `network.stream().text`

## 1.9.2

- Add `filesystem.stream().lines`

## 1.9.1

- Add `array.random`
- Add `array.randomize`

## 1.9.0

- Add `stream`
- Add `filesystem.stream`
- Add `network.stream`

## 1.8.8

- Support "long" format in subnets

## 1.8.7

- Prioritize ipv4 for checking (to improve "long" parsing)
- Allow passing in number (v4) and bigint (v6) into IPAddress constructor
- Fix IPv4 long parsing breaking

## 1.8.6

- Add `network.<IPAddress>.int`
- Allow parsing of "long" ips

## 1.8.5

- Add `network.<IPAddress>.usual`
- Add `network.<IPAddress>.equals`
- Add `network.download`

## 1.8.4

- Add `network.currentIP`

## 1.8.3

- Add `string.replaceAsync`
- Add `string.VariableParser`

## 1.8.2

- Remove bcrypt from dependencies

## 1.8.1

- Improve vite compatibility

## 1.8.0

- Add `dns`
- Use `instanceof` to check for promise

## 1.7.1

- Fix `network.Subnet.size` return type being `BigInt` instead of `bigint`

## 1.7.0

- Remove `network.parseIP`
- Add `network.IPAddress`
- Add `network.Subnet`
- Add `network.isSubnet`

## 1.6.5

- Make `1` a valid ipv4 (1.0.0.0)

## 1.6.4

- Fix IPv6 Validation
- Export `IPAddress` type

## 1.6.3

- Improve `network.isIP`
- Add `network.parseIP`

## 1.6.2

- Dont use `util/types` for browser compatibility

## 1.6.1

- Dont Require `factor` argument in `size` function

## 1.6.0

- Add `size`

## 1.5.5

- Fix unbuilt declarations

## 1.5.4

- Add `array.equal`

## 1.5.3

- Add `time.fn`
- Add typedocs

## 1.5.2

- Add `array.limit`

## 1.5.1

- Remove bcrypt

## 1.5.0

- Add `number.limit`
- Add `time`

## 1.4.5

- Add `array.average`

## 1.4.4

- Add `array.rotate`

## 1.4.3

- More Queue Improvements

## 1.4.2

- Run next queue item after last one finished

## 1.4.1

- Add `queue.Queue.addAndWaitForFinish`

## 1.4.0

- Add `queue`

## 1.3.1

- Add `system.cpu`

## 1.3.0

- Add `number.round`
- Add `array.sum`
- Add `system`

## 1.2.0

- Add `number.percent`
- Add `number.change`
- Fix JSDocs

## 1.1.2

- Added bcrypt related functions

## 1.1.1

- Make `network.test` return ms if success
- Make `network.isIP` return the ip type if success

## 1.1.0

- Add `network`

## 1.0.0

- Publish Package
