import { defineCE, expect, fixture, html, oneEvent, unsafeStatic } from '@open-wc/testing';
import { FakeDispatcher } from './FakeDispatcher';

// test emitter emits and options work

// test disposal bin

describe('event decorator', () => {
  it('should attach event listener', async () => {
    const tag = unsafeStatic(defineCE(FakeDispatcher));
    const dispatcher = await fixture<FakeDispatcher>(html`<${tag}></${tag}>`);
    
    setTimeout(() => dispatcher.fireApplesEvent(), 0);
    const { detail: applesDetail } = await oneEvent(dispatcher, 'applesEvent');
    expect(applesDetail).to.equal('apples');
    
    setTimeout(() => dispatcher.firePersonEvent(), 0);
    const { detail: personDetail } = await oneEvent(dispatcher, 'personEvent');
    expect(personDetail).to.eql({ name: 'apples' });
  });
});
