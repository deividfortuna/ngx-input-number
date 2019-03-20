import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { InputNumberService } from './input-number.service';

@Directive({ selector: '[inputNumber]' })
export class InputNumberDirective {
  @Input() acceptDecimalPlaces = false;
  @Input() decimalPlaces = 2;

  private readonly numbersIntegerOnly: RegExp = /\d+/g;
  private element: HTMLInputElement;

  constructor(
    private inputNumberService: InputNumberService,
    private renderer2: Renderer2,
    private elementRef: ElementRef<HTMLInputElement>) {
    this.element = elementRef.nativeElement;
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
      const indexOfDot = this.element.value.indexOf('.');

      if (this.inputNumberService.isDecimalIndicator(event)) {
        // Allow just one dot
        if (indexOfDot < 0) {
          // Dont allow dots if will trasnform in a invalid value
          if (this.element.value.substr(this.element.selectionStart).length < this.decimalPlaces) {
            return;
          } else {
            event.preventDefault();
          }
        }
        // Is not a dot/decimal indicator
      } else if (indexOfDot > -1) {
        // If is trying to insert the value before the dot
        if (this.element.selectionStart <= indexOfDot) {
          return;
        } else {
          // If is inserting the value after the dot
          const valueAfterDot: string = target.value.substring(indexOfDot + 1);
          // Check if already has the maximum of decimal places
          if (valueAfterDot.length >= this.decimalPlaces) {
            event.preventDefault();
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
    // Cleaning the data before insert in the field
    const cleanedValue = this.inputNumberService
      .removeNonNumbers(pasteValue, this.numbersIntegerOnly, this.acceptDecimalPlaces, this.decimalPlaces);

    document.execCommand('insertText', false, cleanedValue);
    this.renderer2.setProperty(this.elementRef.nativeElement, 'value', cleanedValue);
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event.dataTransfer.getData('text');

    // Cleaning the data before insert in the field
    const cleanedValue = this.inputNumberService
      .removeNonNumbers(textData, this.numbersIntegerOnly, this.acceptDecimalPlaces, this.decimalPlaces);

    this.element.focus();

    document.execCommand('insertText', false, cleanedValue);
    this.renderer2.setProperty(this.elementRef.nativeElement, 'value', cleanedValue);
  }
}
