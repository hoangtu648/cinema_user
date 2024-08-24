import { PaymentService } from 'src/app/services/payment.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from "@angular/router";
import { AccountService } from './account.service';
import { Account } from '../models/account.model';
import { MessageService } from 'primeng/api';
@Injectable()
export class BlockTicketDetailsService implements CanActivate{
    constructor(
        private paymentService: PaymentService,
  
    ){}

    canActivate(){
      
      return this.paymentService.isPassed();
     
    }
}