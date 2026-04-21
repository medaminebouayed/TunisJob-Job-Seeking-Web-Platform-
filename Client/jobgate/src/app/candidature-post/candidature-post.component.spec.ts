import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaturePostComponent } from './candidature-post.component';

describe('CandidaturePostComponent', () => {
  let component: CandidaturePostComponent;
  let fixture: ComponentFixture<CandidaturePostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidaturePostComponent]
    });
    fixture = TestBed.createComponent(CandidaturePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
