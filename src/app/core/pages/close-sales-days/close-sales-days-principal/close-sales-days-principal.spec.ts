import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseSalesDaysPrincipal } from './close-sales-days-principal';

describe('CloseSalesDaysPrincipal', () => {
  let component: CloseSalesDaysPrincipal;
  let fixture: ComponentFixture<CloseSalesDaysPrincipal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloseSalesDaysPrincipal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseSalesDaysPrincipal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
