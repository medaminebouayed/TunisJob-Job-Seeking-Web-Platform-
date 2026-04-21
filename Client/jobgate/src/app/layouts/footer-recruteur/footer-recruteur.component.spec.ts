import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterRecruteurComponent } from './footer-recruteur.component';

describe('FooterRecruteurComponent', () => {
  let component: FooterRecruteurComponent;
  let fixture: ComponentFixture<FooterRecruteurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterRecruteurComponent]
    });
    fixture = TestBed.createComponent(FooterRecruteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
