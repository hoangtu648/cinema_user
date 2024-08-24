import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrlService } from './baseUrl.service';
import { MovieRatings } from '../models/movieRatings.model';
@Injectable()
export class RatingService {
    constructor(
        private baseUrlService: BaseUrlService,
        private httpClient: HttpClient
    ) {}

    async create(rating: MovieRatings) : Promise<any>{
        return await lastValueFrom(this .httpClient.post(this.baseUrlService.getBaseUrl()
        + 'rating/create', rating));
    }

    async findAll(movieId: number) : Promise<any>{
        return await lastValueFrom(this .httpClient.get(this.baseUrlService.getBaseUrl()
        + 'rating/findAll/' + movieId));
    }

    async avg(movieId: number) : Promise<any>{
        return await lastValueFrom(this .httpClient.get(this.baseUrlService.getBaseUrl()
        + 'rating/average/' + movieId));
    }

}