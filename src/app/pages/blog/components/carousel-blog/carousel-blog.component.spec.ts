import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselBlogComponent } from './carousel-blog.component';

describe('CarouselBlogComponent', () => {
  let component: CarouselBlogComponent;
  let fixture: ComponentFixture<CarouselBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
