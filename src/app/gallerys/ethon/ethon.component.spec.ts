import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EthonComponent } from './ethon.component';

describe('EthonComponent', () => {
  let component: EthonComponent;
  let fixture: ComponentFixture<EthonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EthonComponent]
    });
    fixture = TestBed.createComponent(EthonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
