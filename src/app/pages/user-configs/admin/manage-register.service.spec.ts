import { TestBed } from '@angular/core/testing';

import { ManageRegisterService } from './manage-register.service';

describe('ManageRegisterService', () => {
  let service: ManageRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
