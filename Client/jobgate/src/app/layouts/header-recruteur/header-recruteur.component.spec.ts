import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderRecruteurComponent } from './header-recruteur.component';

describe('HeaderRecruteurComponent', () => {
  let component: HeaderRecruteurComponent;
  let fixture: ComponentFixture<HeaderRecruteurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderRecruteurComponent]
    });
    fixture = TestBed.createComponent(HeaderRecruteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
