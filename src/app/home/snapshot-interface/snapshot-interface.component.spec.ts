import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapshotInterfaceComponent } from './snapshot-interface.component';

describe('SnapshotInterfaceComponent', () => {
  let component: SnapshotInterfaceComponent;
  let fixture: ComponentFixture<SnapshotInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnapshotInterfaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapshotInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
