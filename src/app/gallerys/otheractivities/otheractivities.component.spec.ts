import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtheractivitiesComponent } from './otheractivities.component';

describe('OtheractivitiesComponent', () => {
  let component: OtheractivitiesComponent;
  let fixture: ComponentFixture<OtheractivitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtheractivitiesComponent]
    });
    fixture = TestBed.createComponent(OtheractivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
