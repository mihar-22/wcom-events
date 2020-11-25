export interface EventOptions extends EventInit {
  name?: string;
}

/**
 * Dispatches an event of type `T` from the given `target`. Primarily used to type the emitter 
 * returned from the `@event` decorator.
 * 
 * @example
 * ```typescript
 * const target = document.createElement('<div></div>');
 * const emitter = new EventEmitter<string>(target, 'myEvent', { bubbles: true });
 * emitter.emit('apples');
 * ```
 */
export class EventEmitter<T> {
  constructor(
    private target: HTMLElement,
    private eventName: string,
    private options: EventInit = {},
  ) {}

  emit(value: T) {
    this.target.dispatchEvent(
      new CustomEvent<T>(this.eventName, { detail: value, ...this.options }),
    );
  }
}

/**
 * A disposal bin used to add cleanup callbacks that can be called when required. Mostly used to 
 * add stop event listener callbacks returned from `listenTo`.
 * 
 * @example
 * ```typescript
 * const disposal = new Disposal();
 * 
 * // Add cleanup callbacks.
 * disposal.add(listenTo(window, 'click', () => {}));
 * disposal.add(listenTo(window, 'resize', () => {}));
 * 
 * // Empty the bin and flush callbacks.
 * disposal.empty();
 * ```
 */
export class Disposal {
  constructor(
    private dispose: (() => void)[] = [],
  ) {}

  add(callback: () => void) {
    this.dispose.push(callback);
  }

  empty() {
    this.dispose.forEach((fn) => fn());
    this.dispose = [];
  }
}

/**
 * Decorator that creates an `EventEmitter` on the given class property that will dispatch events 
 * from the host element. By default all events emitted bubble up the DOM tree and through the
 * shadows into the light.
 * 
 * @param options - Configures how the event is dispatched.
 */
export function event(options: EventOptions = {}) {
  return (component: HTMLElement, name: string) => {
    const { name: customName, ...eventInitOpts } = options;

    const descriptor = {
      get(this: HTMLElement) {
        return new EventEmitter(this, customName ?? name, {
          bubbles: true,
          composed: true,
          ...eventInitOpts,
        });
      },
      enumerable: true,
      configurable: true,
    };

    return Object.defineProperty(component, name, descriptor);
  };
}

export interface ListenOptions {
  target?: 'body' | 'document' | 'window';
  capture?: boolean;
  passive?: boolean;
}

/**
 * yep.
 */
export function listenTo<T extends Event>(
  node: EventTarget, 
  eventName: string, 
  handler: (event: T) => void,
  options?: boolean | AddEventListenerOptions | EventListenerOptions,
) {
  node.addEventListener(eventName, handler as any, options);
  return () => node.removeEventListener(eventName, handler as any, options);
}

/**
 * yep.
 */
export function listen(eventName: string, options: ListenOptions = {}) {
  return (component: HTMLElement, name: string) => {
    // ...
  }
}