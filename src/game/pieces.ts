import { Piece } from './types';

export const I_PIECE: Piece = {
  type: 'I',
  shape: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],
  color: 'bg-cyan-500',
};

export const O_PIECE: Piece = {
  type: 'O',
  shape: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  color: 'bg-yellow-500',
};

export const T_PIECE: Piece = {
  type: 'T',
  shape: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 1 },
  ],
  color: 'bg-purple-500',
};

export const S_PIECE: Piece = {
  type: 'S',
  shape: [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  color: 'bg-green-500',
};

export const Z_PIECE: Piece = {
  type: 'Z',
  shape: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  color: 'bg-red-500',
};

export const J_PIECE: Piece = {
  type: 'J',
  shape: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  color: 'bg-blue-500',
};

export const L_PIECE: Piece = {
  type: 'L',
  shape: [
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
  color: 'bg-orange-500',
};

const ALL_PIECES: Piece[] = [
  I_PIECE,
  O_PIECE,
  T_PIECE,
  S_PIECE,
  Z_PIECE,
  J_PIECE,
  L_PIECE,
];

export function getRandomPiece(): Piece {
  return ALL_PIECES[Math.floor(Math.random() * ALL_PIECES.length)];
}
