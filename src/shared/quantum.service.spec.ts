import { TestBed } from '@angular/core/testing';

import { QuantumResourcesManpowerAdminService } from './quantum.service';

describe('QuantumResourcesManpowerAdminService', () => {
  let service: QuantumResourcesManpowerAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuantumResourcesManpowerAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
