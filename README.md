# wc-events

[![package-badge]][package]
[![size-badge]][bundlephobia]
[![license-badge]][license]
[![semantic-release-badge]][semantic-release]

[package]: https://www.npmjs.com/package/@mihar/wc-events
[package-badge]: https://img.shields.io/npm/v/@mihar/wc-events
[bundlephobia]: https://bundlephobia.com/result?p=@mihar/wc-events
[size-badge]: https://img.shields.io/bundlephobia/minzip/@mihar/wc-events
[license]: https://github.com/mihar-22/wc-events/blob/master/LICENSE
[license-badge]: https://img.shields.io/github/license/mihar-22/wc-events
[semantic-release]: https://github.com/semantic-release/semantic-release
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

## Guide

...

### Install

```bash
# npm
$: npm install @mihar/wc-events

# yarn
$: yarn add @mihar/wc-events

# pnpm
$: pnpm install @mihar/wc-events
```

### Usage

```ts
import { event, EventEmitter } from "@mihar/wc-events";

class MyComponent extends HTMLElement {
  @event() myEvent!: EventEmitter<string>
}
```

## Related Packages

- [`wc-bob`](https://github.com/mihar-22/wc-bob): CLI to analyze your web components and output 
documentation, types and framework integrations.
- [`wc-context`](https://github.com/mihar-22/wc-context): Pass props down web component trees easily. 
