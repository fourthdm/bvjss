import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndepencedayComponent } from './indepenceday.component';

describe('IndepencedayComponent', () => {
  let component: IndepencedayComponent;
  let fixture: ComponentFixture<IndepencedayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndepencedayComponent]
    });
    fixture = TestBed.createComponent(IndepencedayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
