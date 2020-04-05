import { TestBed } from '@angular/core/testing';

import { CamerasService } from './cameras.service';

describe('CamerasService', () => {
  let service: CamerasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CamerasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
