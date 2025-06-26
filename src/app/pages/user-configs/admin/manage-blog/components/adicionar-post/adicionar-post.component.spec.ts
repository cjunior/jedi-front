import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarPostComponent } from './adicionar-post.component';

describe('AdicionarPostComponent', () => {
  let component: AdicionarPostComponent;
  let fixture: ComponentFixture<AdicionarPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionarPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdicionarPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
