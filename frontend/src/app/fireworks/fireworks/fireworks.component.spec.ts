import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FireworksComponent } from './fireworks.component';

describe('FireworksComponent', () => {
  let component: FireworksComponent;
  let fixture: ComponentFixture<FireworksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FireworksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
