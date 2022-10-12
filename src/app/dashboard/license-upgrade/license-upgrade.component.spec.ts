import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseUpgradeComponent } from './license-upgrade.component';

describe('LicenseUpgradeComponent', () => {
  let component: LicenseUpgradeComponent;
  let fixture: ComponentFixture<LicenseUpgradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenseUpgradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
