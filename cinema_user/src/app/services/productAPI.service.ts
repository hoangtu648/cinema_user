import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
@Injectable()
export class ProductAPIService{
    constructor(
        private baseUrlService: BaseUrlService,
        private httpClient: HttpClient
    ){}
    async findAll(){
        return await lastValueFrom(this.httpClient.get(this.baseUrlService.getBaseUrl()
        + 'product/findAll'));
    }
    async findByName(name: string){
        return await lastValueFrom(this.httpClient.get(this.baseUrlService.getBaseUrl()
        + 'product/findByName/' + name));
    }
    async asc(){
        return await lastValueFrom(this.httpClient.get(this.baseUrlService.getBaseUrl()
        + 'product/asc'));
    }
    async desc(){
        return await lastValueFrom(this.httpClient.get(this.baseUrlService.getBaseUrl()
        + 'product/desc'));
    }
    async sale(){
        return await lastValueFrom(this.httpClient.get(this.baseUrlService.getBaseUrl()
        + 'product/sale'));
    }

}