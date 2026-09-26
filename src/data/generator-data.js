// src/data/generator-data.js
// Listas mínimas conforme SPEC
const prefixes = [
  'Dark', 'Light', 'Shadow', 'Sun', 'Moon', 'Stone', 'Fire', 'Water', 'Wind', 'Earth',
  'Sky', 'Cloud', 'Thunder', 'Ice', 'Lightning', 'Metal', 'Crystal', 'Ash', 'Blood', 'Soul'
];

const suffixes = [
  'Vex', 'Raven', 'Wolf', 'Dragon', 'Knight', 'Queen', 'King', 'Lord', 'Lady', 'Bear',
  'Fox', 'Eagle', 'Serpent', 'Phoenix', 'Tiger', 'Wolf', 'Stag', 'Hawk', 'Owl', 'Beast'
];

export const generateLists = () => ({
  prefixes,
  suffixes,
});