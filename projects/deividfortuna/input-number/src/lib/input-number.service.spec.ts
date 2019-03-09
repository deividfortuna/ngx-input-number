import { TestBed } from '@angular/core/testing';

import { InputNumberService } from './input-number.service';

describe('InputNumberService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [InputNumberService]
  }));

  it('should be created', () => {
    const service: InputNumberService = TestBed.get(InputNumberService);
    expect(service).toBeTruthy();
  });
});
