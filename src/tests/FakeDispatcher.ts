import { event, EventEmitter } from '../index';

export interface Person {
  name: string
}

export class FakeDispatcher extends HTMLElement {
  @event() applesEvent!: EventEmitter<string>
  
  @event() personEvent!: EventEmitter<Person>
  
  fireApplesEvent() {
    this.applesEvent.emit('apples');
  }

  firePersonEvent() {
    this.personEvent.emit({ name: 'apples' });
  }
}