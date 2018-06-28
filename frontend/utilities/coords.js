export const circleOfCoords = ({ lat, lng }, amount) => {
  const radius = 1000; // meters
  const result = [];
  for (let i = 0; i < amount; i++) {
    const angle = Math.PI * 2 * i / amount;
    const dx = radius * Math.cos(angle);
    const dy = radius * Math.sin(angle);
    const latlng = {};
    latlng.lat = lat + (180 / Math.PI) * (dy / 6378137);
    latlng.lng = lng + (180 / Math.PI) * (dx / 6378137) / Math.cos(lat * Math.PI / 180);
    result.push(latlng);
  }
  return result;
};
