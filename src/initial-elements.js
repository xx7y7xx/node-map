export const nodes = [
  {
    id: 'input',
    type: 'input',
    data: {
      label: 'input',
    },
    position: { x: 250, y: 0 },
  },
  {
    id: 'transform',
    data: {
      label: 'transform',
    },
    position: { x: 100, y: 100 },
  },
  {
    id: 'output',
    data: {
      label: 'output',
    },
    position: { x: 250, y: 200 },
  },
];

export const edges = [
  { id: 'e1-2', source: 'input', target: 'transform' },
];
