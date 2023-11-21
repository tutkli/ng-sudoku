import { Component } from '@angular/core';
import { Sudoku } from './sudoku/sudoku';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Sudoku],
  template: `
    <app-sudoku />
  `,
})
export class AppComponent {}
