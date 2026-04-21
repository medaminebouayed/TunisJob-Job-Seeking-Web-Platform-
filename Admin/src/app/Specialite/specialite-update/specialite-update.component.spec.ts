import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialiteUpdateComponent } from './specialite-update.component';

describe('SpecialiteUpdateComponent', () => {
  let component: SpecialiteUpdateComponent;
  let fixture: ComponentFixture<SpecialiteUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialiteUpdateComponent]
    });
    fixture = TestBed.createComponent(SpecialiteUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
