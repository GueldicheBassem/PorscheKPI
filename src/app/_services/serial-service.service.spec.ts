import { TestBed } from '@angular/core/testing';

import { SerialServiceService } from './serial-service.service';

describe('SerialServiceService', () => {
  let service: SerialServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerialServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
