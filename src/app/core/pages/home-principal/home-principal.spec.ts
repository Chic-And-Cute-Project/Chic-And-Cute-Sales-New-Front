import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePrincipal } from './home-principal';

describe('HomePrincipal', () => {
  let component: HomePrincipal;
  let fixture: ComponentFixture<HomePrincipal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePrincipal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePrincipal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
