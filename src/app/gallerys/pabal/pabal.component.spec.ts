import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PabalComponent } from './pabal.component';

describe('PabalComponent', () => {
  let component: PabalComponent;
  let fixture: ComponentFixture<PabalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PabalComponent]
    });
    fixture = TestBed.createComponent(PabalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
