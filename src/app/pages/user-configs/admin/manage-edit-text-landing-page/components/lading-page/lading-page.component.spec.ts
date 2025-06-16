import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LadingPageeditComponent } from './lading-page.component';

describe('LadingPageComponent', () => {
  let component: LadingPageeditComponent;
  let fixture: ComponentFixture<LadingPageeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LadingPageeditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LadingPageeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
