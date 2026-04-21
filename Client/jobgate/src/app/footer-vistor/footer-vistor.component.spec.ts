import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterVistorComponent } from './footer-vistor.component';

describe('FooterVistorComponent', () => {
  let component: FooterVistorComponent;
  let fixture: ComponentFixture<FooterVistorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterVistorComponent]
    });
    fixture = TestBed.createComponent(FooterVistorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
