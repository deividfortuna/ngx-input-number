import { InputNumberDirective } from './input-number.directive';
import { TestBed } from '@angular/core/testing';
import { InputNumberService } from './input-number.service';
import { Renderer2, ElementRef } from '@angular/core';

describe('InputNumberDirective', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [InputNumberDirective],
    providers: [InputNumberService, Renderer2, { provide: ElementRef, useValue: {} }]
  }));

  it('should create an instance', () => {
    const directive = new InputNumberDirective(
      TestBed.get(InputNumberService),
      TestBed.get(ElementRef)
    );
    expect(directive).toBeTruthy();
  });
});