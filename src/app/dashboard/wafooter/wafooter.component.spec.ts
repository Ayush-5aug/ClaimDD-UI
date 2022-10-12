import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WAfooterComponent } from './wafooter.component';

describe('WAfooterComponent', () => {
  let component: WAfooterComponent;
  let fixture: ComponentFixture<WAfooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WAfooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WAfooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
