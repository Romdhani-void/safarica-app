import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePromos } from './manage-promos';

describe('ManagePromos', () => {
  let component: ManagePromos;
  let fixture: ComponentFixture<ManagePromos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePromos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePromos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
