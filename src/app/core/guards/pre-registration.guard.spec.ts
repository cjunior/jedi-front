import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { preRegistrationGuard } from './pre-registration.guard';

describe('preRegistrationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => preRegistrationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
