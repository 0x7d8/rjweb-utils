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