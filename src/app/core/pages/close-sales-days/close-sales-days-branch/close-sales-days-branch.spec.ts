import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseSalesDaysBranch } from './close-sales-days-branch';

describe('CloseSalesDaysBranch', () => {
  let component: CloseSalesDaysBranch;
  let fixture: ComponentFixture<CloseSalesDaysBranch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloseSalesDaysBranch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseSalesDaysBranch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
