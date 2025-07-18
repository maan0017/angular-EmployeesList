import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]',
})
export class NumberOnlyDirective {
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Enter',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
