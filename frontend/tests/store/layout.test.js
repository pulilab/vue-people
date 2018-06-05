import { state, getters, actions, mutations } from '~/store/layout';
import { mockAxios } from '../utils';

test('store state is unique between calls', () => {
  const s = state();
  expect(s).not.toBe(state());
  expect(s).toEqual(state());
});

describe('getters', () => {
  let s = null;

  beforeEach(() => {
    s = state();
  });

  test('getOptOutDialogOpen', () => {
    let result = getters.getOptOutDialogOpen(s);
    expect(result).toEqual(s.optOutDialogOpen);
    s.optOutDialogOpen = true;
    result = getters.getOptOutDialogOpen(s);
    expect(result).toEqual(s.optOutDialogOpen);
  });
});

describe('actions', () => {
  const vuex = {};

  beforeEach(() => {
    vuex.commit = jest.fn();
    vuex.dispatch = jest.fn();
    vuex.getters = {};
    vuex.state = state();
    actions.$axios = mockAxios();
  });

  test('setOptOutDialogOpen', () => {
    actions.setOptOutDialogOpen(vuex, true);
    expect(vuex.commit).toHaveBeenLastCalledWith('SET_OUT_OUT_DIALOG_OPEN', true);
  });
});

describe('mutations', () => {
  test('SET_OUT_OUT_DIALOG_OPEN', () => {
    const state = {};
    mutations.SET_OUT_OUT_DIALOG_OPEN(state, 1);
    expect(state.optOutDialogOpen).toEqual(1);
  });

});
