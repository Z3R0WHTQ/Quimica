
import { elementsPart1 } from '@/data/elements-part-1';
import { elementsPart2 } from '@/data/elements-part-2';
import { elementsPart3 } from '@/data/elements-part-3';
import { elementsPart4 } from '@/data/elements-part-4';
import { elementsPart5 } from '@/data/elements-part-5';
import { elementsPart6 } from '@/data/elements-part-6';

const allElements = [
  ...elementsPart1,
  ...elementsPart2,
  ...elementsPart3,
  ...elementsPart4,
  ...elementsPart5,
  ...elementsPart6,
];

export const getAllElements = () => {
  return allElements;
};

export const getElementBySymbol = (symbol) => {
  return allElements.find(el => el.symbol === symbol);
};

export const getElementByAtomicNumber = (atomicNumber) => {
  return allElements.find(el => el.atomicNumber === atomicNumber);
};

export const getElementsByCategory = (category) => {
  return allElements.filter(el => el.category === category);
};
