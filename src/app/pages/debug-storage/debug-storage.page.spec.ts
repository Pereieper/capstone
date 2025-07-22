import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugStoragePage } from './debug-storage.page';

describe('DebugStoragePage', () => {
  let component: DebugStoragePage;
  let fixture: ComponentFixture<DebugStoragePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugStoragePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
