import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarEmailSenhaComponent } from './recuperar-email-senha.component';

describe('RecuperarEmailSenhaComponent', () => {
  let component: RecuperarEmailSenhaComponent;
  let fixture: ComponentFixture<RecuperarEmailSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarEmailSenhaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperarEmailSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
