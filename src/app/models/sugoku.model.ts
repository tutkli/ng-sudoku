export type Board = number[][];
export type BoardStatus = 'solved' | 'unsolved' | 'broken';
export type BoardDifficulty = 'easy' | 'medium' | 'hard' | 'random';

export interface IGetBoard {
  board: Board;
}

export interface IValidateBoard {
  status: BoardStatus;
}

export interface ISolveBoard {
  difficulty: BoardDifficulty;
  solution: Board;
  status: BoardStatus;
}

export interface IGradeBoard {
  difficulty: BoardDifficulty;
}
