import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

@Injectable()
export class CinemaService{
    constructor(
        private baseUrlService: BaseUrlService,
        private httpClient: HttpClient
    ){}
    async findAll() : Promise<any>{
        return await lastValueFrom(this .httpClient.get(this.baseUrlService.getBaseUrl()
        + 'cinema/findAll'));
    }
   
}