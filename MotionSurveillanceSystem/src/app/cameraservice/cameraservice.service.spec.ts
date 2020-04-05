import { TestBed } from '@angular/core/testing';

import { CameraserviceService } from './cameraservice.service';

describe('CameraserviceService', () => {
  let service: CameraserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
