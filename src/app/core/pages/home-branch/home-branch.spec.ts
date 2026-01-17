import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBranch } from './home-branch';

describe('HomeBranch', () => {
  let component: HomeBranch;
  let fixture: ComponentFixture<HomeBranch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeBranch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeBranch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
