import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSuperadmin } from './home-superadmin';

describe('HomeSuperadmin', () => {
  let component: HomeSuperadmin;
  let fixture: ComponentFixture<HomeSuperadmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeSuperadmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSuperadmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
