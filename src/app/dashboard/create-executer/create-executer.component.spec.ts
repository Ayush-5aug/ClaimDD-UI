import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExecuterComponent } from './create-executer.component';

describe('CreateExecuterComponent', () => {
  let component: CreateExecuterComponent;
  let fixture: ComponentFixture<CreateExecuterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExecuterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExecuterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
