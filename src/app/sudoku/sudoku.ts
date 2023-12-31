import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BoardDifficulty } from '../models/sugoku.model';
import { ButtonDirective } from '../ui/button.directive';
import { ReadonlyCellPipe } from './readonly-cell.pipe';
import { injectSudokuService } from './sudoku.service';

@Component({
  selector: 'app-sudoku',
  standalone: true,
  imports: [ReadonlyCellPipe, ButtonDirective, TitleCasePipe],
  template: `
    <div class="flex flex-col items-center space-y-4">
      <h1 class="text-5xl font-semibold">NG Sudoku</h1>
      <div
        class="grid h-96 w-96 grid-cols-9 gap-[1px] border-4 border-black bg-black">
        @for (
          row of sudokuService.board();
          track rowIndex;
          let rowIndex = $index
        ) {
          @for (col of row; track colIndex; let colIndex = $index) {
            <input
              type="number"
              class="border-black bg-white text-center"
              min="1"
              max="9"
              (change)="onChange($event, rowIndex, colIndex)"
              [value]="col === 0 ? '' : col"
              [readOnly]="col | readonlyCell: rowIndex : colIndex"
              [class.text-gray-400]="col | readonlyCell: rowIndex : colIndex"
              [class.border-b-2]="rowIndex === 2 || rowIndex === 5"
              [class.border-r-2]="colIndex === 2 || colIndex === 5" />
          }
        }
      </div>

      <div class="flex w-full items-center justify-between space-x-2">
        <span class="text-xl font-semibold">Generate:</span>
        @for (difficulty of difficulties; track $index) {
          <button
            appButton
            type="button"
            (click)="sudokuService.generateBoard(difficulty)">
            {{ difficulty | titlecase }}
          </button>
        }
      </div>

      <div class="flex w-full items-center justify-between">
        <div
          class="flex items-center overflow-hidden rounded-lg border border-gray-500">
          <button
            appButton
            variant="blue"
            class="rounded-none"
            type="button"
            (click)="sudokuService.validateBoard()">
            Validate
          </button>
          <div class="p-2 font-semibold">{{ sudokuService.status() }}</div>
        </div>

        <div
          class="flex items-center overflow-hidden rounded-lg border border-gray-500">
          <div class="p-2 font-semibold">{{ sudokuService.difficulty() }}</div>
          <button appButton variant="blue" class="rounded-none" type="button">
            Difficulty
          </button>
        </div>
      </div>

      <button
        appButton
        variant="green"
        class="w-full"
        (click)="sudokuService.solveBoard()">
        Solve
      </button>
    </div>
  `,
  host: {
    class: 'flex flex-col w-screen h-screen justify-center items-center',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sudoku implements OnInit {
  protected sudokuService = injectSudokuService();

  difficulties: BoardDifficulty[] = ['easy', 'medium', 'hard', 'random'];

  ngOnInit() {
    this.sudokuService.generateBoard('random');
  }

  onChange(event: Event, rowIndex: number, colIndex: number) {
    this.sudokuService.updateBoard(
      (event.target as HTMLInputElement).valueAsNumber,
      rowIndex,
      colIndex
    );
  }
}
