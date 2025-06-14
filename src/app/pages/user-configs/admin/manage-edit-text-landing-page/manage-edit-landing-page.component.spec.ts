import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEditLandingPageComponent } from './manage-edit-landing-page.component';

describe('ManageEditLandingPageComponent', () => {
  let component: ManageEditLandingPageComponent;
  let fixture: ComponentFixture<ManageEditLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageEditLandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEditLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
