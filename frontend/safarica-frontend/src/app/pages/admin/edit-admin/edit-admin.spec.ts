import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdmin } from './edit-admin';

describe('EditAdmin', () => {
  let component: EditAdmin;
  let fixture: ComponentFixture<EditAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
