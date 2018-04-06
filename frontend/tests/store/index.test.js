import { state, getters } from '~/store/index';

test('store state is unique between calls', () => {
  const s = state();
  expect(s).not.toBe(state());
  expect(s).toEqual(state());
});


describe('getters', ()  => {
  let s = null;

  beforeEach(() => {
    s = state();
  });

  test('getUserTypes', () => {
    const result = getters.getUserTypes(s);
    expect(result).toEqual(s.userTypes);
    expect(result).not.toBe(s.userTypes);
  })
});
