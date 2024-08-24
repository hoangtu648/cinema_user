import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { Booking, BookingDetails } from "../models/booking.model";

@Injectable()
export class BookingService{
    constructor(
        private baseUrlService: BaseUrlService,
        private httpClient: HttpClient
    ){}
    async create(booking: Booking) : Promise<any>{
        return await lastValueFrom(this .httpClient.post(this.baseUrlService.getBaseUrl()
        + 'booking/create', booking));
    }
    async createBookingDetails(bookingDetails: BookingDetails) : Promise<any>{
        return await lastValueFrom(this .httpClient.post(this.baseUrlService.getBaseUrl()
        + 'booking/createBookingDetails', bookingDetails));
    }
    async findSeatByName(name: string) : Promise<any>{
        return await lastValueFrom(this .httpClient.get(this.baseUrlService.getBaseUrl()
        + 'booking/findSeatByName/' + name));
    }
}