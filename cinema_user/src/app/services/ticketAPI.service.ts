import { Injectable } from "@angular/core";
import { BaseUrlService } from "./baseUrl.service";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { TicketAddPost } from "../models/ticket.model";
@Injectable()
export class TicketAPIService {
  constructor(
    private baseUrlService: BaseUrlService,
    private httpClient: HttpClient
  ) {}

  async add(tickets: TicketAddPost[]) {
    return await lastValueFrom(
      this.httpClient.post(
        this.baseUrlService.getBaseUrl() + "tickets/add",
        tickets
      )
    );
  }
}
