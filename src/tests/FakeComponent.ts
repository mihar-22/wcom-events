import { event, EventEmitter, listen } from '../index';

export interface Person {
  name: string
}

export class FakeComponent extends HTMLElement {
  orangesListenerCalls = 0;

  inferredListenerCalls = 0;
 
  connectedCalls = 0;
  
  disconnectedCalls = 0;

  @event() applesEvent!: EventEmitter<string>
  
  @event() personEvent!: EventEmitter<Person>

  connectedCallback() {
    this.connectedCalls += 1;
  }

  disconnectedCallback() {
    this.disconnectedCalls += 1;
  }
  
  fireApplesEvent() {
    this.applesEvent.emit('apples');
  }

  firePersonEvent() {
    this.personEvent.emit({ name: 'apples' });
  }

  @listen('orangesEvent')
  onCustomEvent() {
    this.orangesListenerCalls += 1;
  }

  @listen()
  onInferredEvent() {
    this.inferredListenerCalls += 1;
  }
}