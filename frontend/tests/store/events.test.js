import { state, getters, actions, mutations } from '~/store/events';
import { mockAxios } from '../utils';
import * as meetupUtilities from '~/integrations/meetup/utilities';

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

  test('getEvents', () => {
    const result = getters.getEvents(s);
    expect(result).toEqual(s.meetupEvents);
    expect(result).not.toBe(s.meetupEvents);
  });

  test('getMeetups', () => {
    s.meetups = [{ id: 1, latlng: {}, options: {} }];
    const getEvents = [ { group_id: 2 } ];
    let result = getters.getMeetups(s, {getEvents});
    expect(result).toEqual(s.meetups);
    expect(result).not.toBe(s.meetups);
    expect(result[0]).toEqual(s.meetups[0]);
    expect(result[0]).not.toBe(s.meetups[0]);

    getEvents[0].group_id = 1;
    result = getters.getMeetups(s, {getEvents});
    expect(result).toEqual(s.meetups);
    expect(result).not.toBe(s.meetups);
    expect(result[0]).toEqual(s.meetups[0]);
    expect(result[0]).not.toBe(s.meetups[0]);

    getEvents[0].venue = {lat: 1, lon: 2};
    result = getters.getMeetups(s, {getEvents});

    expect(result[0].latlng).toEqual({lat: 1, lng: 2});
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
    actions.$axios = mockAxios();
  });

  test('loadMeetups', async () => {
    jest.spyOn(meetupUtilities, 'groupParser').mockReturnValue(1);
    jest.spyOn(meetupUtilities, 'overlappingResolver').mockReturnValue(1);
    actions.$axios.get.mockReturnValue({data: [1]});
    await actions.loadMeetups(vuex);
    expect(meetupUtilities.groupParser).toHaveBeenCalledWith(1, 0, [1]);
    expect(meetupUtilities.overlappingResolver).toHaveBeenCalledWith([1]);
    expect(vuex.commit).toHaveBeenCalledWith('SET_MEETUP_LIST', 1);
  });

  test('setCurrent', () => {
    actions.setCurrent(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_CURRENT_MEETUP', 1]);
  });
});

describe('mutations', () => {
  test('SET_MEETUP_LIST', () => {
    const s = {};
    mutations.SET_MEETUP_LIST(s, [1]);
    expect(s.meetups).toEqual([1]);
  });

  test('SET_CURRENT_MEETUP', () => {
    const s = {};
    mutations.SET_CURRENT_MEETUP(s, 1);
    expect(s.currentMeetup).toEqual(1);
  });

  test('ADD_MEETUP_EVENTS', () => {
    const s = {};
    mutations.ADD_MEETUP_EVENTS(s, 1);
    expect(s.meetupEvents).toEqual(1);
  });
});
