# wc-events

[![package-badge]][package]
[![size-badge]][bundlephobia]
[![license-badge]][license]
[![coverage-badge]][coverage]
[![semantic-release-badge]][semantic-release]

[package]: https://www.npmjs.com/package/@mihar/wc-events
[package-badge]: https://img.shields.io/npm/v/@mihar/wc-events
[bundlephobia]: https://bundlephobia.com/result?p=@mihar/wc-events
[size-badge]: https://img.shields.io/bundlephobia/minzip/@mihar/wc-events
[license]: https://github.com/mihar-22/wc-events/blob/master/LICENSE
[license-badge]: https://img.shields.io/github/license/mihar-22/wc-events
[coverage]: https://codecov.io/github/mihar-22/wc-events
[coverage-badge]: https://img.shields.io/codecov/c/github/mihar-22/wc-events.svg
[semantic-release]: https://github.com/semantic-release/semantic-release
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

## Introduction

A simple library containing a collection of decorators and helpers for working with events inside 
web components. This library is expected to be used with [TypeScript](https://www.typescriptlang.org), 
make sure to set `experimentalDecorators` to `true ` in `tsconfig.json`.

## Install

```bash
# npm
$: npm install @mihar/wc-events

# yarn
$: yarn add @mihar/wc-events

# pnpm
$: pnpm install @mihar/wc-events
```

## Usage

### `EventEmitter`

Dispatches a custom event from the given target. Mainly used to type the emitter returned 
from the [`@event`](#event) decorator.

```ts
const target = document.createElement('<div></div>');
const emitter = new EventEmitter<string>(target, 'myEvent', { bubbles: true });
emitter.emit('apples');
```

### `Disposal`

A disposal bin used to add cleanup callbacks that can be called when required. Mostly used to 
add stop event listener callbacks returned from [`listenTo`](#listenTo).

```ts
const disposal = new Disposal();

function onClick() {
  // ...
}

function onResize() {
  // ...
}

// Add cleanup callbacks.
disposal.add(listenTo(window, 'click', onClick);
disposal.add(listenTo(window, 'resize', onResize);

// Empty the bin and flush callbacks.
disposal.empty();
```

### `@event`

Decorator that creates an [`EventEmitter`](#EventEmitter) on the given class property that will dispatch events 
from the host element. By default all events emitted bubble up the DOM tree and through the
shadows into the light.

```ts
class MyComponent extends HTMLElement {
  // 1.
  @event() myEvent!: EventEmitter<string>;

  // 2.
  @event({
    name: 'customEventName',
    bubbles: true,
    composed: true,
  }) anotherEvent!: EventEmitter<void>
}
```

### `@listen`

Attaches an event listener to the host element _or_ the given `target`. The event name can be inferred 
from the method name if it is named following JSX conventions such as `onEventName`, which will 
listen for `eventName`. The event is automatically cleaned up when the element is disconnected 
from the DOM.

```ts
class MyComponent extends HTMLElement {
  // 1.
  @listen('customEvent')
  onSomeEvent() {
    // ...
  }

  // 2. Target can be set to `document`, `window` or `undefined` which will default to host.
  @listen('click', { target: 'window' })
  onWindowClick() {
    // ...
  }

  // 3. Event name is inferred here as `myEvent`.
  @listen()
  onMyEvent() {
    // ...
  }
}
```

### `listenTo`

Listens to an event on the given `target` and returns a cleanup function to stop listening.

```ts
function onResize() {
  // ...
}

// Options are listed with their default values.
const off = listenTo(window, 'resize', onResize, { 
  capture: false, 
  passive: false, 
  once: false,
});

// Stop listening.
off();
```

## Related Packages

- [`wc-bob`](https://github.com/mihar-22/wc-bob): CLI to analyze your web components and output 
documentation, types and framework integrations.
- [`wc-context`](https://github.com/mihar-22/wc-context): Pass props down web component trees easily. 
