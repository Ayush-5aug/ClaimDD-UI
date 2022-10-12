import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContemporaryRecordsComponent } from './contemporary-records.component';

describe('ContemporaryRecordsComponent', () => {
  let component: ContemporaryRecordsComponent;
  let fixture: ComponentFixture<ContemporaryRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContemporaryRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContemporaryRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
