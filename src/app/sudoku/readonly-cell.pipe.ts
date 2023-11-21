import { Pipe, PipeTransform } from '@angular/core';
import { injectSudokuService } from './sudoku.service';

@Pipe({
  standalone: true,
  name: 'readonlyCell',
})
export class ReadonlyCellPipe implements PipeTransform {
  private sudokuService = injectSudokuService();

  transform(value: number, rowIndex: number, colIndex: number): boolean {
    return (
      value !== 0 &&
      !this.sudokuService.dynamicCells.has(
        this.sudokuService.generateCellRef(rowIndex, colIndex)
      )
    );
  }
}
