import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Payment, TicketDetail } from 'src/app/models/payment.model';
import { PaymentService } from 'src/app/services/payment.service';

@Component({

  templateUrl: './ticket_details.component.html',
})
export class TicketDetailsComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ){}
    paymentId: number;
    payment: TicketDetail;
    seatNames: string;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
        const showIdParam = params["paymentId"];
        this.paymentId = showIdParam;
     
      });
      this.paymentService.findById(this.paymentId).then(
        (response) => {
            this.payment = response as TicketDetail;
            // this.seatNames = this.payment.bookingDetails.map(detail => detail.seatName).join(', ');
            console.log(this.payment);
        },
        (err) => {

        }
      );
  }

  getSeatNames(): string {
    return this.payment.bookingDetails.map(detail => detail.seatId).join(', ');
  }
}