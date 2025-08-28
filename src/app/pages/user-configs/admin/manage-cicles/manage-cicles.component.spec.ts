import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCiclesComponent } from './manage-cicles.component';

describe('ManageCiclesComponent', () => {
  let component: ManageCiclesComponent;
  let fixture: ComponentFixture<ManageCiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCiclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
