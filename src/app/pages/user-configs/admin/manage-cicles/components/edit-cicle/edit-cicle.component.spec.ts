import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCicleComponent } from './edit-cicle.component';

describe('EditCicleComponent', () => {
  let component: EditCicleComponent;
  let fixture: ComponentFixture<EditCicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
