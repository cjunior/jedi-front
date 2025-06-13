import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselSquareComponent } from './carousel.component';

describe('CarouselComponent', () => {
  let component: CarouselSquareComponent;
  let fixture: ComponentFixture<CarouselSquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselSquareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
