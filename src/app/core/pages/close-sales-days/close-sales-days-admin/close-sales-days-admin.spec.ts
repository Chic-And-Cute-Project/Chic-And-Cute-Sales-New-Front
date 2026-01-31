import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseSalesDaysAdmin } from './close-sales-days-admin';

describe('CloseSalesDaysAdmin', () => {
  let component: CloseSalesDaysAdmin;
  let fixture: ComponentFixture<CloseSalesDaysAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloseSalesDaysAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseSalesDaysAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
