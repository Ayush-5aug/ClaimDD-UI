import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapshotTechnicalComponent } from './snapshot-technical.component';

describe('SnapshotTechnicalComponent', () => {
  let component: SnapshotTechnicalComponent;
  let fixture: ComponentFixture<SnapshotTechnicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnapshotTechnicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapshotTechnicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
