import { TestBed } from '@angular/core/testing';

import { FpService } from './fp.service';

describe('FpService', () => {
  let service: FpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
