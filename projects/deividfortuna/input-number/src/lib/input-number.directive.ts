import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { InputNumberService } from './input-number.service';

@Directive({ selector: '[inputNumber]' })
export class InputNumberDirective {
  @Input() acceptDecimalPlaces = false;
  @Input() decimalPlaces = 2;

  private element: HTMLInputElement;

  constructor(
    private inputNumberService: InputNumberService,
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
          if (this.element.value.substr(this.element.selectionStart).length <= this.decimalPlaces) {
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
          const quantityCharSelected: number = this.element.selectionEnd - this.element.selectionStart;
          // console.log('quantityCharSelected: ', quantityCharSelected);
          const hasSelection: boolean = quantityCharSelected > 0;
          if (hasSelection) {
            return;
          } else {
            // Check if already has the maximum of decimal places
            if (valueAfterDot.length >= this.decimalPlaces) {
              event.preventDefault();
            }
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

  @HostListener('paste', ['$event', '$event.target']) onPaste(event: ClipboardEvent, target: HTMLInputElement) {
    event.preventDefault();
    event.stopPropagation();

    const pastedEntry: string = event.clipboardData.getData('text');
    const cleanedValue = this.cleanEntry(target, pastedEntry);

    this.element.focus();

    const inserted = document.execCommand('insertText', false, cleanedValue);

    // If something goes wrong on insert text, like firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1220696
    if (!inserted) {
      // TODO: Fix another issue with firefox to put the text in the selection start
      if (this.element.value !== cleanedValue) {
        this.element.value = cleanedValue;
        this.element.dispatchEvent(new Event('input'));

        this.element.addEventListener('focusout', () => {
          this.element.dispatchEvent(new Event('change'));
        }, { once: true });
      }
    }
  }

  @HostListener('drop', ['$event', '$event.target']) onDrop(event: any, target: HTMLInputElement) {
    event.preventDefault();
    event.stopPropagation();
    const dropedEntry = event.dataTransfer.getData('text');

    const cleanedValue = this.cleanEntry(target, dropedEntry);
    this.element.focus();

    const inserted = document.execCommand('insertText', false, cleanedValue);

    // If something goes wrong on insert text, like firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1220696
    if (!inserted) {
      if (this.element.value !== cleanedValue) {
        this.element.value = cleanedValue;
        this.element.dispatchEvent(new Event('input'));

        this.element.addEventListener('focusout', () => {
          this.element.dispatchEvent(new Event('change'));
        }, { once: true });
      }
    }
  }

  private cleanEntry(target: HTMLInputElement, pastedEntry: string) {
    const indexOfDot = target.value.indexOf('.');
    const hasDecimalAlready = indexOfDot > -1;
    const keepDecimals = !hasDecimalAlready && this.acceptDecimalPlaces;
    const isAddingDecimalsNumbers = hasDecimalAlready && (target.selectionStart > indexOfDot);
    const quantityCharSelected: number = target.selectionEnd - target.selectionStart;
    const hasSelection: boolean = quantityCharSelected > 0;

    // Cleaning the data before insert in the field
    let cleanedValue = this.inputNumberService
      .removeNonNumbers(pastedEntry, keepDecimals, this.decimalPlaces);
    if (this.acceptDecimalPlaces && isAddingDecimalsNumbers) {
      const quantityOfNewDecimalsAllowed = hasSelection
        ? quantityCharSelected
        : this.decimalPlaces - target.value.substring(indexOfDot + 1).length;

      cleanedValue = cleanedValue.substring(0, quantityOfNewDecimalsAllowed);
    }
    return cleanedValue;
  }
}
