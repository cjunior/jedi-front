import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCicleComponent } from './view-cicle.component';

describe('ViewCicleComponent', () => {
  let component: ViewCicleComponent;
  let fixture: ComponentFixture<ViewCicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
