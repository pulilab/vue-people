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
    jest.spyOn(meetupUtilities, 'eventHasValidLatLng').mockReturnValue(true);
    s.meetups = [{ id: 1, latlng: {}, options: {} }];
    const getEvents = [
      { id: 1, group_id: 2, time: 1 },
      { id: 2, group_id: 3, time: 2 },
      { id: 3, group_id: 4, time: 3 }
    ];
    let result = getters.getMeetups(s, {getEvents});
    expect(result).toEqual(
      [{
        event: undefined,
        has_event_with_coords: false,
        id: 1,
        latlng: {},
        options: {}
      }]
    );
    expect(result).not.toBe(s.meetups);
    expect(result[0]).not.toBe(s.meetups[0]);

    getEvents[2].group_id = 1;
    getEvents[0].group_id = 1;
    getEvents[0].latlng = {lat: 0, lng: 2};
    getEvents[1].group_id = 1;
    getEvents[1].latlng = {lat: 3, lng: 0};
    result = getters.getMeetups(s, {getEvents});

    expect(result[0].event.id).toBe(1);
    expect(result[0].latlng).toEqual({lat: 0, lng: 2});
  });

  test('getCurrentMeetup', () => {
    expect(getters.getCurrentMeetup(s)).toEqual(s.currentMeetup);
  });

  test('getMeetupDetails', () => {
    const getMeetups = [{id: 1}, {id: 2}];
    const getEvents = [{group_id: 1}];
    let result = getters.getMeetupDetails(s, {getMeetups, getEvents})(1);
    expect(result).toEqual({...getMeetups[0], events: [getEvents[0]]});
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

  test('loadEvents', async () => {
    jest.spyOn(meetupUtilities, 'eventParser').mockReturnValue(1);
    jest.spyOn(meetupUtilities, 'overlappingResolver').mockReturnValue(1);
    actions.$axios.get.mockReturnValue({data: [1]});
    await actions.loadEvents(vuex);
    expect(meetupUtilities.eventParser).toHaveBeenCalledWith(1, 0, [1]);
    expect(meetupUtilities.overlappingResolver).toHaveBeenCalledWith([1]);
    expect(vuex.commit).toHaveBeenCalledWith('ADD_MEETUP_EVENTS', 1);
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
