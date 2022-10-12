import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WAheaderComponent } from './waheader.component';

describe('WAheaderComponent', () => {
  let component: WAheaderComponent;
  let fixture: ComponentFixture<WAheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WAheaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WAheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
