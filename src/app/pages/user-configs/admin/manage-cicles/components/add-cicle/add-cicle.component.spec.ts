import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCicleComponent } from './add-cicle.component';

describe('AddCicleComponent', () => {
  let component: AddCicleComponent;
  let fixture: ComponentFixture<AddCicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
