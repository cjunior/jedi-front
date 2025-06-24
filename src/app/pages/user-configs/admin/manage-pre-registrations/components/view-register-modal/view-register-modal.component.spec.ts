import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRegisterModalComponent } from './view-register-modal.component';

describe('ViewRegisterModalComponent', () => {
  let component: ViewRegisterModalComponent;
  let fixture: ComponentFixture<ViewRegisterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRegisterModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRegisterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
