import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

@Injectable()
export class ShowTimeService{
    constructor(
        private baseUrlService: BaseUrlService,
        private httpClient: HttpClient
    ){}
    async findById(id: number) : Promise<any>{
        return await lastValueFrom(this .httpClient.get(this.baseUrlService.getBaseUrl()
        + 'showTime/findById/'+ id));
    }
    async checkSeat(id: number) : Promise<any>{
        return await lastValueFrom(this .httpClient.get(this.baseUrlService.getBaseUrl()
        + 'showTime/checkSeat/'+ id));
    }
    async findMovie(date: string, cinemaId: number, movieId: number) : Promise<any>{
        return await lastValueFrom(this.httpClient.get(this.baseUrlService.getBaseUrl()
        + 'showTime/findMovie?date='+ date + '&cinemaId=' + cinemaId + '&movieId=' + movieId));
    }
}