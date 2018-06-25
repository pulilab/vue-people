export const groupParser = (m) => (
  {
    id: m.id,
    name: m.name,
    latlng: {
      lat: m.lat,
      lng: m.lon
    }
  }
);
