import { TestBed } from '@angular/core/testing';

import { CashfreeserviceService } from './cashfreeservice.service';

describe('CashfreeserviceService', () => {
  let service: CashfreeserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashfreeserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
