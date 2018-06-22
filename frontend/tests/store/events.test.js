import { state, getters, actions, mutations } from '~/store/events';

test('meetup state is unique between calls', () => {
  const s = state();
  expect(s).not.toBe(state());
  expect(s).toEqual(state());
});

describe('getters', () => {
  let s = null;

  beforeEach(() => {
    s = state();
  });

  test('getMeetups', () => {
    s.meetups = [{ id: 1 }];
    const result = getters.getMeetups(s);
    expect(result).toEqual(s.meetups);
    expect(result).not.toBe(s.meetups);
    expect(result[0]).toEqual(s.meetups[0]);
    expect(result[0]).not.toBe(s.meetups[0]);
  });

  test('getCurrentMeetup', () => {
    expect(getters.getCurrentMeetup(s)).toEqual(s.currentMeetup);
  });

  test('getMeetupDetails', () => {
    const getMeetups = [{id: 1}, {id: 2}];
    let result = getters.getMeetupDetails(s, {getMeetups})(1);
    expect(result).toEqual(getMeetups[0]);
    expect(result).not.toBe(getMeetups[0]);
  });

  test('getCurrentMeetupDetails', () => {
    const getCurrentMeetup = 1;
    const getMeetupDetails = jest.fn();
    getters.getCurrentMeetupDetails(s, {getCurrentMeetup, getMeetupDetails});
    expect(getMeetupDetails).toHaveBeenCalledWith(1);
  });
});

describe('actions', () => {
  const vuex = {};

  beforeEach(() => {
    vuex.commit = jest.fn();
  });

  test('loadMeetups', () => {
    actions.loadMeetups(vuex);
    expect(vuex.commit).toHaveBeenCalledWith('SET_MEETUP_LIST', [{id:1}]);
  });

  test('setCurrent', () => {
    actions.setCurrent(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_CURRENT_MEETUP', 1]);
  });
});

describe('mutations', () => {
  test('SET_MEETUP_LIST', () => {
    const s = {};
    mutations.SET_MEETUP_LIST(s, 1);
    expect(s.meetups).toEqual(1);
  });

  test('SET_CURRENT_MEETUP', () => {
    const s = {};
    mutations.SET_CURRENT_MEETUP(s, 1);
    expect(s.currentMeetup).toEqual(1);
  });
});
