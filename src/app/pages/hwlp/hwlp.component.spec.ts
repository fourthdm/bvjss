import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HwlpComponent } from './hwlp.component';

describe('HwlpComponent', () => {
  let component: HwlpComponent;
  let fixture: ComponentFixture<HwlpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HwlpComponent]
    });
    fixture = TestBed.createComponent(HwlpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
