# InputNumber

An Angular directive only allows [0-9] and the feature of decimal numbers in the input box when typing, pasting or drag/dropping. This directive handles both Windows keyboard and Mac keyboard.


## Installation
```bash
npm i @deividfortuna/input-number
```

## Accept only integers numbers
```html
  <input type="text"
        inputNumber>
```

## Accept decimal numbers

```html
<input type="text"
       inputNumber
       [acceptDecimalPlaces]="true"
       [decimalPlaces]="3">
```
## API Reference 
Import directive module
```typescript
import { InputNumberModule } from '@deividfortuna/input-number';
```

Add the directive module to your angular module
```typescript
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    InputNumberModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Properties

`acceptDecimalPlaces`: `boolean` (default: `false`): Wheter the input will accept decimal or not

`decimalPlaces`: `integer` (default: `2`): Number of decimal places allowed when `acceptDecimalPlaces` is set to `true`
