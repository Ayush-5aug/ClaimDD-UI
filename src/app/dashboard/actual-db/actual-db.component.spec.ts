import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualDbComponent } from './actual-db.component';

describe('ActualDbComponent', () => {
  let component: ActualDbComponent;
  let fixture: ComponentFixture<ActualDbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualDbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
