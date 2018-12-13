export const apiReadParser = data => {
  const r = {};
  if (data.location) {
    r.location = {
      lat: data.location.coordinates[0],
      lng: data.location.coordinates[1]
    };
  }
  if (data.user) {
    r.email = data.user.email || undefined;
    r.name = data.user.first_name || undefined;
    r.user = undefined;
  }
  r.type = data.type ? data.type : 1;
  return {...data, ...r};
};

export const apiWriteParser = data => {
  const r = {
    location: undefined,
    user: {
      last_name: ''
    }
  };
  if (data.location) {
    r.location = {
      type: 'Point',
      coordinates: [data.location.lat, data.location.lng]
    };
  }
  r.user.email = data.email ? data.email : '';
  data.email = undefined;
  if (data.name) {
    r.user.first_name = data.name;
    data.name = undefined;
  }
  return {...data, ...r};
};

export const latLngParser = p => {
  if (p.location && p.location.lat) {
    return {
      lat: p.location.lat,
      lng: p.location.lng
    };
  }
};

export const personParser = (d) => {
  const p = apiReadParser(d);
  const latlng = latLngParser(p);
  const type = p.type ? p.type : 1;
  return {
    ...p,
    latlng,
    type,
    location: undefined
  };
}
;
