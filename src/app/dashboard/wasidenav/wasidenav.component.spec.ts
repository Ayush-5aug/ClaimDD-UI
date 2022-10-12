import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WASidenavComponent } from './wasidenav.component';

describe('WASidenavComponent', () => {
  let component: WASidenavComponent;
  let fixture: ComponentFixture<WASidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WASidenavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WASidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
