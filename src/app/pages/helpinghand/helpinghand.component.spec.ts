import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpinghandComponent } from './helpinghand.component';

describe('HelpinghandComponent', () => {
  let component: HelpinghandComponent;
  let fixture: ComponentFixture<HelpinghandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelpinghandComponent]
    });
    fixture = TestBed.createComponent(HelpinghandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
