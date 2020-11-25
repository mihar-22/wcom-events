export interface EventOptions extends EventInit {
  name?: string;
}

/**
 * Dispatches a custom event of type `T` from the given `target`. Primarily used to type the emitter 
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
          cancelable: true,
          composed: true,
          ...eventInitOpts,
        });
      },
      enumerable: true,
      configurable: true,
    };

    Object.defineProperty(component, name, descriptor);
  };
}

export interface ListenOptions {
  target?: 'document' | 'window';
  capture?: boolean;
  passive?: boolean;
}

/**
 * Listens to an event on the given `target` and returns a cleanup function to stop listening.
 * 
 * @param eventTarget - The target to listen for the events on.
 * @param eventName - The name of the event to listen to.
 * @param handler - The function to be called when the event is fired.
 * @param options - Configures the event listener.
 * 
 * @example
 * ```typescript
 * const off = listenTo(window, 'resize', () => {});
 * 
 * // Stop listening.
 * off();
 * ```
 */
export function listenTo<T extends Event>(
  eventTarget: EventTarget, 
  eventName: string, 
  handler: (event: T) => void,
  options?: boolean | AddEventListenerOptions | EventListenerOptions,
) {
  eventTarget.addEventListener(eventName, handler as any, options);
  return () => eventTarget.removeEventListener(eventName, handler as any, options);
}
    

export interface CustomHTMLElement extends HTMLElement {
  connectedCallback?: () => void
  disconnectedCallback?: () => void
}

/**
 * Attaches an event listener to the host element or the given `target`. The event name can be inferred 
 * from the method name if it is named following JSX conventions such as `onEventName`, which will 
 * listen for `eventName`. The event is automatically cleaned up when the element is disconnected 
 * from the DOM.
 *  
 * @param eventName (optional) - The name of the event to listen to.
 * @param options - Configures the event listener.
 */
export function listen(eventName?: string, options: ListenOptions = {}) {
  return (component: CustomHTMLElement, name: string) => {
    const { target, ...listenerOptions } = options;
    
    // Converts method name `onEventName` to `eventName` if no event is given.
    let evName = eventName ?? (name.charAt(2).toLowerCase() + name.slice(3));
        
    const eventHandler = (component as any)[name];
    const LISTENER_KEY = Symbol(`${evName}Listener`);

    const { connectedCallback } = component;
    component.connectedCallback = function (this: CustomHTMLElement) {
      let eventTarget: EventTarget = this;
      if (target === 'document') eventTarget = document;
      else if (target === 'window') eventTarget = window;

      (this as any)[LISTENER_KEY] = listenTo(
        eventTarget, 
        evName, 
        eventHandler.bind(this), 
        listenerOptions
      );

      if (connectedCallback) return connectedCallback.call(this);
    }

    const { disconnectedCallback } = component;
    component.disconnectedCallback = function(this: CustomHTMLElement) {
      (this as any)[LISTENER_KEY]?.();
      delete (this as any)[LISTENER_KEY];
      if (disconnectedCallback) return disconnectedCallback.call(this);
    }
  }
}