import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

@Injectable()
export class FollowService{
    constructor(
        private baseUrlService: BaseUrlService,
        private httpClient: HttpClient
    ){}
    async create(follow: any) : Promise<any>{
        return await lastValueFrom(this .httpClient.post(this.baseUrlService.getBaseUrl()
        + 'follow/create', follow));
    }
    async findById(id: number) : Promise<any>{
        return await lastValueFrom(this .httpClient.get(this.baseUrlService.getBaseUrl()
        + 'follow/findById/' + id));
    }
   
}