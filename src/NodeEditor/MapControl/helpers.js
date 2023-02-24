export const fillColor = (colorBaseOnField = '') => (
  [
    'step',
    ['get', colorBaseOnField],
    '#EFFF85',
    1, '#98F300',
    2, '#37C508',
    3, '#00CA8D',
    4, '#0098A3',
  ]
);

export const isEmpty = (geojson) => {
  if (geojson.type === 'FeatureCollection') {
    return geojson.features.length === 0;
  }
  // if (geojson.type === 'Feature') { }
  return false;
};
