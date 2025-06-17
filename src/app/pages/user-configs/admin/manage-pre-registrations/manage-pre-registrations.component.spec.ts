import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePreRegistrationsComponent } from './manage-pre-registrations.component';

describe('ManagePreRegistrationsComponent', () => {
  let component: ManagePreRegistrationsComponent;
  let fixture: ComponentFixture<ManagePreRegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePreRegistrationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePreRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
