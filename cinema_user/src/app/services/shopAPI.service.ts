import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
@Injectable()
export class ShopAPIService{
    constructor(
        private baseUrlService: BaseUrlService,
        private httpClient: HttpClient
    ){}
    async findByCategoryID(categoryID: number){
        return await lastValueFrom(this.httpClient.get(this.baseUrlService.getBaseUrl()
        + 'shop/findByCategoryID/' + categoryID));
    }
    async findByName(name: string, categoryID: number){
        return await lastValueFrom(this.httpClient.get(this.baseUrlService.getBaseUrl()
        + 'shop/findByName/' + name + '/' + categoryID));
    }

}