import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractParticularsComponent } from './contract-particulars.component';

describe('ContractParticularsComponent', () => {
  let component: ContractParticularsComponent;
  let fixture: ComponentFixture<ContractParticularsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractParticularsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractParticularsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
