import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngx-input-number';
  valueInteger =  new FormControl('');
  valueDecimal =  new FormControl('');

  constructor() {
    this.valueDecimal.valueChanges.subscribe(value => {
      console.log('value changed: ', value);
    });
  }
}
