import { Injectable } from '@angular/core';

@Injectable()
export class InputNumberService {

  constructor() { }

  removeNonNumbers(value: string, regex: RegExp, keepDecimals: boolean = false, decimalPlace: number = 0): string {
    let result: RegExpMatchArray = value.match(regex);
    if (result && result.length) {

      if (keepDecimals && result[1]) {
        return result[0] + '.' + result[1].substr(0, decimalPlace);
      } else {
        return result[0];
      }
    }
    return null;
  }

  getKeyCode(event: KeyboardEvent): number {
    return event.keyCode;
  }

  hasSelection(input: HTMLInputElement) {
    if (typeof input.selectionStart === 'number') {
      return input.selectionStart !== input.selectionEnd;
    }
  }

  isDecimalIndicator(event: KeyboardEvent) {
    return ((this.getKeyCode(event) === 110 && event.shiftKey === false) // Decimal Point
      || (this.getKeyCode(event) === 190 && event.shiftKey === false)); // Period
  }
}
