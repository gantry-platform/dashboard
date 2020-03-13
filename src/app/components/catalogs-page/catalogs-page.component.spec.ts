import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogsPageComponent } from './catalogs-page.component';

describe('CatalogsPageComponent', () => {
  let component: CatalogsPageComponent;
  let fixture: ComponentFixture<CatalogsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
