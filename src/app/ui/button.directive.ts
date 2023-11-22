import { Directive, Input, OnChanges, signal } from '@angular/core';
import { VariantProps } from 'cva';
import { cva } from '../utils/cva.util';

const buttonVariants = cva({
  base: 'rounded-lg px-4 py-2',
  variants: {
    variant: {
      ghost: '',
      outline: 'border border-gray-500 hover:bg-gray-100',
      blue: 'bg-blue-500 text-white hover:bg-blue-600',
      green: 'bg-green-500 text-white hover:bg-green-600',
    },
  },
  defaultVariants: {
    variant: 'ghost',
  },
});
type ButtonVariants = VariantProps<typeof buttonVariants>;

@Directive({
  selector: 'button[appButton]',
  standalone: true,
  host: {
    '[attr.class]': 'buttonClass()',
  },
})
export class ButtonDirective implements OnChanges {
  @Input() variant: ButtonVariants['variant'] = 'ghost';
  @Input() class = '';

  protected buttonClass = signal(
    buttonVariants({ variant: this.variant, className: this.class })
  );

  ngOnChanges() {
    this.buttonClass.set(
      buttonVariants({ variant: this.variant, className: this.class })
    );
  }
}
