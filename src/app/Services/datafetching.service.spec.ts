import { TestBed } from '@angular/core/testing';

import { DatafetchingService } from './datafetching.service';

describe('DatafetchingService', () => {
  let service: DatafetchingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatafetchingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
