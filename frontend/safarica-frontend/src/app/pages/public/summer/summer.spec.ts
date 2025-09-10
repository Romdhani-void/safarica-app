import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Summer } from './summer';

describe('Summer', () => {
  let component: Summer;
  let fixture: ComponentFixture<Summer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Summer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Summer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
