import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { InputNumberService } from './input-number.service';

@Directive({ selector: '[inputNumber]' })
export class InputNumberDirective {
  @Input() acceptDecimalPlaces = false;
  @Input() decimalPlaces = 2;

  private readonly numbersIntegerOnly: RegExp = /\d+/g;

  constructor(
    private inputNumberService: InputNumberService,
    private renderer2: Renderer2,
    private elementRef: ElementRef<HTMLInputElement>) {
  }

  @HostListener('keydown', ['$event', '$event.target']) onInput(event: KeyboardEvent, target: HTMLInputElement) {
    const key: number = this.inputNumberService.getKeyCode(event);

    if ([46, 8, 9, 27, 13].indexOf(key) !== -1 // Allow: Delete, Backspace, Tab, Escape, Enter
      || (key === 65 && event.ctrlKey === true) // Allow: Ctrl+A
      || (key === 67 && event.ctrlKey === true) // Allow: Ctrl+C
      || (key === 86 && event.ctrlKey === true) // Allow: Ctrl+V
      || (key === 88 && event.ctrlKey === true) // Allow: Ctrl+X
      || (key === 90 && event.ctrlKey === true) // Allow: Ctrl+Z
      || (key === 65 && event.metaKey === true) // Cmd+A (Mac)
      || (key === 67 && event.metaKey === true) // Cmd+C (Mac)
      || (key === 86 && event.metaKey === true) // Cmd+V (Mac)
      || (key === 88 && event.metaKey === true) // Cmd+X (Mac)
      || (key === 90 && event.metaKey === true) // Cmd+Z (Mac)
      || ((key >= 96 && key <= 105)) // Allow NumPad keys
      || (key >= 35 && key <= 39) // Home, End, Left, Right
    ) {
      return;
    }

    if (this.acceptDecimalPlaces) {
      const indexOfDot = this.elementRef.nativeElement.value.indexOf('.');

      // Allow Decimal Point/Period if the already have some numbers
      if (this.inputNumberService.isDecimalIndicator(event) && (indexOfDot < 0)) {
        return;
      }

      // If accept decimal places check if there is already two decimal numbers and prevent new ones
      if (indexOfDot > -1) {
        if (this.elementRef.nativeElement.selectionStart <= indexOfDot && !this.inputNumberService.isDecimalIndicator(event)) {
          return;
        } else {
          const valueAfterDot: string = target.value.substring(indexOfDot + 1);
          if (valueAfterDot.length >= this.decimalPlaces) {
            event.preventDefault();
            return;
          }
        }
      }
    }

    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (key < 48 || key > 57))
      && (key < 96 || key > 105)
    ) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteValue: string = event.clipboardData.getData('text');
    const cleanedValue = this.inputNumberService
      .removeNonNumbers(pasteValue, this.numbersIntegerOnly, this.acceptDecimalPlaces, this.decimalPlaces);

    this.renderer2.setProperty(this.elementRef.nativeElement, 'value', cleanedValue);
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event.dataTransfer.getData('text');
    const cleanedValue = this.inputNumberService
      .removeNonNumbers(textData, this.numbersIntegerOnly, this.acceptDecimalPlaces, this.decimalPlaces);

    this.elementRef.nativeElement.focus();

    this.renderer2.setProperty(this.elementRef.nativeElement, 'value', cleanedValue);
  }
}
