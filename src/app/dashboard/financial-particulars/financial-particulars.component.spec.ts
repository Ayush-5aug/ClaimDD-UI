import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialParticularsComponent } from './financial-particulars.component';

describe('FinancialParticularsComponent', () => {
  let component: FinancialParticularsComponent;
  let fixture: ComponentFixture<FinancialParticularsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialParticularsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialParticularsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
