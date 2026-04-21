import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderVistorComponent } from './header-vistor.component';

describe('HeaderVistorComponent', () => {
  let component: HeaderVistorComponent;
  let fixture: ComponentFixture<HeaderVistorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderVistorComponent]
    });
    fixture = TestBed.createComponent(HeaderVistorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
