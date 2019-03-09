import { NgModule } from '@angular/core';
import { InputNumberDirective } from './input-number.directive';
import { InputNumberService } from './input-number.service';

@NgModule({
  declarations: [InputNumberDirective],
  providers: [InputNumberService],
  imports: [],
  exports: [InputNumberDirective]
})
export class InputNumberModule { }
