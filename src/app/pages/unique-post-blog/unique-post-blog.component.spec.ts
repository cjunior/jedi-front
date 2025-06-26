import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniquePostBlogComponent } from './unique-post-blog.component';

describe('UniquePostBlogComponent', () => {
  let component: UniquePostBlogComponent;
  let fixture: ComponentFixture<UniquePostBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniquePostBlogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniquePostBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
