import { circleOfCoords } from '../../utilities/coords';

export const groupParser = (m) => (
  {
    id: m.id,
    name: m.name,
    latlng: {
      lat: m.lat,
      lng: m.lon
    },
    group_photo: m.group_photo ? m.group_photo.photo_link : undefined,
    key_photo: m.key_photo ? m.key_photo.photo_link : undefined,
    next_event: m.next_event,
    members: m.members,
    location: m.localized_location,
    link: m.link,
    description: m.description
  }
);

export const overlappingResolver = markers => {
  const dict = markers.reduce((p, c, index) => {
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
}
;
