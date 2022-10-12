import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatePreviewComponent } from './rate-preview.component';

describe('RatePreviewComponent', () => {
  let component: RatePreviewComponent;
  let fixture: ComponentFixture<RatePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
