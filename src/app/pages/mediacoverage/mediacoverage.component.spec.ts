import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediacoverageComponent } from './mediacoverage.component';

describe('MediacoverageComponent', () => {
  let component: MediacoverageComponent;
  let fixture: ComponentFixture<MediacoverageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MediacoverageComponent]
    });
    fixture = TestBed.createComponent(MediacoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
