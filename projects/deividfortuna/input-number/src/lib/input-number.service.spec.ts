import { TestBed } from '@angular/core/testing';

import { InputNumberService } from './input-number.service';

const dirtyNumber = 'abcdefghijklmnopqrstuxzwyABCDEFGHIJKLMNOPQRSTUXZWY1234567890.!@#$%^&666*()_-;:{}|[]';

describe('InputNumberService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [InputNumberService]
  }));

  it('should be created', () => {
    const service: InputNumberService = TestBed.get(InputNumberService);
    expect(service).toBeTruthy();
  });

  describe('clean data', () => {
    it('should clean integer', () => {
      const service: InputNumberService = TestBed.get(InputNumberService);

      const result = service.removeNonNumbers(dirtyNumber, false);

      expect(result).toEqual('1234567890');
    });

    it('should clean decimal', () => {
      const service: InputNumberService = TestBed.get(InputNumberService);

      const result = service.removeNonNumbers(dirtyNumber, true, 3);

      expect(result).toEqual('1234567890.666');
    });
  });
});
