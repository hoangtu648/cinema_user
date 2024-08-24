import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { Booking, BookingDetails } from "../models/booking.model";
import { Payment, PaymentRequest } from "../models/payment.model";

@Injectable()
export class PaymentService{
    constructor(
        private baseUrlService: BaseUrlService,
        private httpClient: HttpClient
    ){}
    public status: boolean =  false;
    async create(payment: Payment) : Promise<any>{
        return await lastValueFrom(this .httpClient.post(this.baseUrlService.getBaseUrl()
        + 'payment/create', payment));
    }

    async findById(id: number) : Promise<any>{
        return await lastValueFrom(this .httpClient.get(this.baseUrlService.getBaseUrl()
        + 'payment/findById/' + id));
    }
    async sendMail(email: any) : Promise<any>{
        return await lastValueFrom(this .httpClient.post(this.baseUrlService.getBaseUrl()
        + 'payment/sendMail', email));
    }
    async sendSMS(sms: any) : Promise<any>{
        return await lastValueFrom(this .httpClient.get(this.baseUrlService.getBaseUrl()
        + 'payment/sendSMS?body=' + sms));
    }


    async vnpay(paymentRequest: PaymentRequest) : Promise<any>{
        return await lastValueFrom(this .httpClient.post(this.baseUrlService.getBaseUrl()
        + 'vnpay/initiate', paymentRequest));
    }
    
    paymentService(_status: boolean){
        this.status = _status;
    }
    isPassed(){
        return this.status;
    }
}