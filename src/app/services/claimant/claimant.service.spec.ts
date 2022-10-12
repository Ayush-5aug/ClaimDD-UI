import { TestBed } from '@angular/core/testing';

import { ClaimantService } from './claimant.service';

describe('ClaimantService', () => {
  let service: ClaimantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaimantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
