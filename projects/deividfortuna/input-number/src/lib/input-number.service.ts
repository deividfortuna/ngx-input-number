import { Injectable } from '@angular/core';

@Injectable()
export class InputNumberService {
  private readonly numbersIntegerOnly: RegExp = /\d+/g;

  constructor() { }

  removeNonNumbers(value: string, keepDecimals: boolean = false, decimalPlace: number = 0): string {
    const result: RegExpMatchArray = value.match(this.numbersIntegerOnly);
    if (result && result.length) {

      if (keepDecimals && result[1]) {
        return result[0] + '.' + result[1].substr(0, decimalPlace);
      } else {
        return result[0];
      }
    }
    return '';
  }

  getKeyCode(event: KeyboardEvent): number {
    return event.which || event.keyCode;
  }

  isDecimalIndicator(event: KeyboardEvent) {
    return ((this.getKeyCode(event) === 110 && event.shiftKey === false) // Decimal Point
      || (this.getKeyCode(event) === 190 && event.shiftKey === false)); // Period
  }
}
