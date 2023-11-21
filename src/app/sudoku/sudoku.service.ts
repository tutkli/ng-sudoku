import { signal } from '@angular/core';
import { createInjectionToken } from 'ngxtension/create-injection-token';
import {
  Board,
  BoardDifficulty,
  BoardStatus,
  IGetBoard,
  IGradeBoard,
  ISolveBoard,
  IValidateBoard,
} from '../models/sugoku.model';

const encodeBoard = (board: number[][]) =>
  board.reduce(
    (result, row, i) =>
      result +
      `%5B${encodeURIComponent(row as never)}%5D${
        i === board.length - 1 ? '' : '%2C'
      }`,
    ''
  );

const encodeParams = (params: { board: number[][] }) =>
  Object.keys(params)
    .map(key => key + '=' + `%5B${encodeBoard(params[key as 'board'])}%5D`)
    .join('&');

export const [injectSudokuService, provideSudokuService] = createInjectionToken(
  () => {
    const board = signal<Board>([]);
    const status = signal<BoardStatus>('unsolved');
    const difficulty = signal<BoardDifficulty>('random');
    const dynamicCells = new Set<string>();

    const generateBoard = (boardDifficulty: BoardDifficulty) => {
      fetch(`https://sugoku.onrender.com/board?difficulty=${boardDifficulty}`)
        .then<IGetBoard>(res => res.json())
        .then(data => board.set(data.board));

      gradeBoard();
      dynamicCells.clear();
    };

    const generateCellRef = (rowIndex: number, colIndex: number) =>
      `${rowIndex} - ${colIndex}`;

    const gradeBoard = () => {
      fetch('https://sugoku.onrender.com/grade', {
        method: 'POST',
        body: encodeParams({ board: board() }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
        .then<IGradeBoard>(response => response.json())
        .then(response => difficulty.set(response.difficulty));
    };

    const updateBoard = (value: number, rowIndex: number, colIndex: number) => {
      dynamicCells.add(generateCellRef(rowIndex, colIndex));
      board.update(prev =>
        prev.map((row, rIndex) => {
          if (rIndex !== rowIndex) return row;
          return row.map((col, cIndex) => {
            if (cIndex !== colIndex) return col;
            return value;
          });
        })
      );
    };

    const validateBoard = () => {
      fetch('https://sugoku.onrender.com/validate', {
        method: 'POST',
        body: encodeParams({ board: board() }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
        .then<IValidateBoard>(response => response.json())
        .then(response => status.set(response.status));
    };

    const solveBoard = () => {
      fetch('https://sugoku.onrender.com/solve', {
        method: 'POST',
        body: encodeParams({ board: board() }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
        .then<ISolveBoard>(response => response.json())
        .then(response => {
          board.set(response.solution);
          status.set(response.status);
        });
    };

    return {
      board: board.asReadonly(),
      status: status.asReadonly(),
      difficulty: difficulty.asReadonly(),
      generateBoard,
      updateBoard,
      validateBoard,
      solveBoard,
      dynamicCells,
      generateCellRef,
    };
  }
);
