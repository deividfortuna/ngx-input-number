import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngx-input-number';
  valueInteger = new FormControl('');
  valueDecimal = new FormControl('');
  lastChangeDecimal = null;

  constructor() {
    this.valueDecimal.valueChanges.subscribe(value => {
      // console.log('decimal changed: ', value);
      this.lastChangeDecimal = value;
    });

    this.valueInteger.valueChanges.subscribe(value => {
      // console.log('integer changed: ', value);
    });
  }

  onDecimalChange(value: string) {
    // console.log('changed called: ', value);
  }
}
