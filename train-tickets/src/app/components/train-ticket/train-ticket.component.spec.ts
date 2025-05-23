import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainTicketComponent } from './train-ticket.component';

describe('TrainTicketComponent', () => {
  let component: TrainTicketComponent;
  let fixture: ComponentFixture<TrainTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
