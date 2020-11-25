import { defineCE, expect, fixture, html, oneEvent, unsafeStatic } from '@open-wc/testing';
import { Disposal, EventEmitter, listenTo } from '..';
import { FakeComponent } from './FakeComponent';
    
const fakeComponentTag = unsafeStatic(defineCE(FakeComponent));

describe('EventEmitter', () => {
  it('should dispatch event from target', async () => {
    const target = await fixture<HTMLDivElement>(html`<div></div>`);
    const emitter = new EventEmitter<string>(target, 'applesEvent');
    setTimeout(() => emitter.emit('apples'));
    const { detail } = await oneEvent(target, 'applesEvent');
    expect(detail).to.equal('apples');
  });
});

describe('Disposal', () => {
  it('should empty bin', () => {
    const disposal = new Disposal();
    let calls = 0;
    let cleanup = () => { calls += 1 };
    disposal.add(cleanup);
    disposal.add(cleanup);
    disposal.empty();
    expect(calls).to.equal(2);
  });
});

describe('@event', () => {
  it('should attach event listener', async () => {
    const dispatcher = await fixture<FakeComponent>(html`<${fakeComponentTag}></${fakeComponentTag}>`);
    
    setTimeout(() => dispatcher.fireApplesEvent(), 0);
    const { detail: applesDetail } = await oneEvent(dispatcher, 'applesEvent');
    expect(applesDetail).to.equal('apples');
    
    setTimeout(() => dispatcher.firePersonEvent(), 0);
    const { detail: personDetail } = await oneEvent(dispatcher, 'personEvent');
    expect(personDetail).to.eql({ name: 'apples' });
  });
});

describe('listenTo', () => {
  it('should listen to event on target', async () => {
    const target = await fixture<HTMLDivElement>(html`<div><${fakeComponentTag}></${fakeComponentTag}></div>`);
    const dispatcher = target.firstChild as FakeComponent;

    // Should call handler.
    let calls = 0;
    const handler = () => { calls += 1; };
    const off = listenTo(target, 'applesEvent', handler);
    setTimeout(() => dispatcher.fireApplesEvent())
    await oneEvent(dispatcher, 'applesEvent');
    expect(calls).to.equal(1);

    // Should stop listening.
    off();
    setTimeout(() => dispatcher.fireApplesEvent());
    await oneEvent(dispatcher, 'applesEvent');
    expect(calls).to.equal(1);
  });
});

describe('@listen', () => {
  it('should attach listener in connectedCallback', async () => {
    const wc = await fixture<FakeComponent>(html`<${fakeComponentTag}><div></div></${fakeComponentTag}>`);
    const dispatcher = wc.firstChild as HTMLDivElement;
    setTimeout(() => dispatcher.dispatchEvent(new CustomEvent('orangesEvent', { bubbles: true })));
    await oneEvent(dispatcher, 'orangesEvent');
    expect(wc.connectedCalls).to.equal(1);
    expect(wc.orangesListenerCalls).to.equal(1);
  });

  it('should infer event name from method', async () => {
    const wc = await fixture<FakeComponent>(html`<${fakeComponentTag}><div></div></${fakeComponentTag}>`);
    const dispatcher = wc.firstChild as HTMLDivElement;
    setTimeout(() => dispatcher.dispatchEvent(new CustomEvent('inferredEvent', { bubbles: true })));
    await oneEvent(dispatcher, 'inferredEvent');
    expect(wc.connectedCalls).to.equal(1);
    expect(wc.inferredListenerCalls).to.equal(1);
  });

  it('should remove event listener on cleanup', async () => {
    const wc = await fixture<FakeComponent>(html`<${fakeComponentTag}><div></div></${fakeComponentTag}>`);
    const dispatcher = wc.firstChild as HTMLDivElement;
    wc.disconnectedCallback();
    setTimeout(() => dispatcher.dispatchEvent(new CustomEvent('orangesEvent', { bubbles: true })));
    await oneEvent(dispatcher, 'orangesEvent');
    expect(wc.disconnectedCalls).to.equal(1);
    expect(wc.orangesListenerCalls).to.equal(0);
  });
});