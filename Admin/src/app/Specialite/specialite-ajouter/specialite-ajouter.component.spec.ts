import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialiteAjouterComponent } from './specialite-ajouter.component';

describe('SpecialiteAjouterComponent', () => {
  let component: SpecialiteAjouterComponent;
  let fixture: ComponentFixture<SpecialiteAjouterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialiteAjouterComponent]
    });
    fixture = TestBed.createComponent(SpecialiteAjouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
