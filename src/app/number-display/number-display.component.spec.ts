import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberDisplayComponent } from './number-display.component';

describe('NumberDisplayComponent', () => {
  let component: NumberDisplayComponent;
  let fixture: ComponentFixture<NumberDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NumberDisplayComponent]
    });
    fixture = TestBed.createComponent(NumberDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
