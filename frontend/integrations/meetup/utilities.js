import { circleOfCoords } from '../../utilities/coords';

export const groupParser = (m) => {
  const id = m.id;
  m = m.data;
  return {
    id,
    name: m.name,
    latlng: {
      lat: m.lat,
      lng: m.lon
    },
    group_photo: m.group_photo ? m.group_photo.photo_link : undefined,
    key_photo: m.key_photo ? m.key_photo.photo_link : undefined,
    members: m.members,
    location: m.localized_location,
    link: m.link,
    urlname: m.urlname,
    description: m.description
  };
};

export const eventParser = e => {
  const id = e.id;
  const date = e.date;
  e = e.data;
  const local_parsed_time = e.time + e.utc_offset;
  return {
    id,
    date,
    link: e.link,
    name: e.name,
    latlng: e.venue ? { lat: e.venue.lat, lng: e.venue.lon } : undefined,
    venue: e.venue ? {
      address_1: e.venue.address_1,
      zip: e.venue.zip,
      city: e.venue.city
    } : undefined,
    time: e.time,
    local_parsed_time,
    duration: e.duration ? e.duration : 10800000,
    local_time: e.local_time,
    local_date: e.local_date,
    group_id: e.group.id,
    rsvp_limit: e.rsvp_limit,
    yes_rsvp_count: e.yes_rsvp_count,
    description: e.description
  };
};

export const overlappingResolver = markers => {
  const dict = markers.reduce((p, c, index) => {
    if (!c.latlng) {
      return p;
    }
    const key = JSON.stringify(c.latlng);
    if (p[key]) {
      p[key].push(index);
    } else {
      p[key] = [index];
    }
    return p;
  }, {});
  for (const k in dict) {
    if (dict[k].length > 1) {
      const latlng = JSON.parse(k);
      const circle = circleOfCoords(latlng, dict[k].length);
      dict[k].forEach((value, index) => {
        markers[value].latlng = circle[index];
      });
    }
  }
  return markers;
};

export const eventHasValidLatLng = event => {
  return event &&
  event.latlng &&
  (event.latlng.lat || event.latlng.lng);
};
