import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConfigsComponent } from './user-configs.component';

describe('UserConfigsComponent', () => {
  let component: UserConfigsComponent;
  let fixture: ComponentFixture<UserConfigsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserConfigsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
