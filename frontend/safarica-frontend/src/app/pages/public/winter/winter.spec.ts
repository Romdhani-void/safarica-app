import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Winter } from './winter';

describe('Winter', () => {
  let component: Winter;
  let fixture: ComponentFixture<Winter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Winter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Winter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
