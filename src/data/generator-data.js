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

const abilities = [
  'Controla sombras', 'Manipula raios', 'Lança fogo', 'Cura feridas', 'Telecinese',
  'Leitura de mentes', 'Invisibilidade', 'Super força', 'Velocidade extrema', 'Voo',
  'Transformação', 'Controle de água', 'Manipula terra', 'Respira fogo', 'Invocação de luz'
];

const backgrounds = [
  'Busca vingança', 'Protege os fracos', 'Quer dominar o mundo', 'Foi traído',
  'Perdeu a família', 'Busca redenção', 'Foi criado em laboratório', 'Foi amaldiçoado',
  'Quer justiça', 'Buscador de verdade'
];

export const generateLists = () => ({
  prefixes,
  suffixes,
  abilities,
  backgrounds,
});