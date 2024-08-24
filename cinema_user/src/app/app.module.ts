import { NgModule } from "@angular/core";
import { BrowserModule, DomSanitizer } from "@angular/platform-browser";
import { ToastModule } from "primeng/toast";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GallaryComponent } from "./components/gallary/gallary.component";
import { ProductComponent } from "./components/product/product.component";
import { Food_DrinkComponent } from "./components/food-drink/food_drink.component";
import { HomeComponent } from "./components/home/home.component";
import { ShopAPIService } from "./services/shopAPI.service";
import { BaseUrlService } from "./services/baseUrl.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ShoppingComponent } from "./components/shopping/shopping.component";
import { Enter_learnComponent } from "./components/enter_learn/enter_learn.component";
import { ProductAPIService } from "./services/productAPI.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AboutComponent } from "./components/about/about.component";
import { NewsComponent } from "./components/news/news.component";
import { GallaryAPIService } from "./services/gallaryAPI.service";
import { EditorModule } from "primeng/editor";
import { RatingModule } from "primeng/rating";
import { ButtonModule } from "primeng/button";
import { FieldsetModule } from "primeng/fieldset";
import { InputTextModule } from "primeng/inputtext";
import { HomeCinemaComponent } from "./components/Cinema home/homecinema.component";
import { BuyTicketComponent } from "./components/Buy ticket/buy_ticket.component";
import { FeedbackAPIService } from "./services/feedbackapi.service";
import { FeedbackComponent } from "./components/feedback/feedback.component";
import { ConfirmationService, MessageService } from "primeng/api";
import { ShowAPIService } from "./services/showAPI.service";
import { TicketAPIService } from "./services/ticketAPI.service";
import { MovieService } from "./services/movie.service";
import { DatePipe } from "@angular/common";
import { ShowTimeService } from "./services/showTime.service";
import { ComboService } from "./services/combo.service";
import { InputNumberModule } from 'primeng/inputnumber';
import { BookingService } from "./services/booking.service";
import { NgxPayPalModule } from 'ngx-paypal';
import { TicketDetailsComponent } from "./components/Ticket details/ticket_details.component";
import { QRCodeModule } from 'angularx-qrcode';
import { PaymentService } from "./services/payment.service";
import { CinemaService } from "./services/cinema.service";
import { MovieDetailsComponent } from "./components/Movie details/movie_details.component";
import { ChatComponent } from "./components/Chat/chat.component";
import { ChatService } from "./services/chatService.service";
import { Login_SignupComponent } from "./components/accounts/login_signup.component";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccountService } from "./services/account.service";
import { VerifyAccountComponent } from "./components/verify/verify-account.component";
import { RssService } from "./services/rss.service";
import { ForgotPasswordComponent } from "./components/forgot_password/forgot_pass.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { RatingService } from "./services/rating.service";
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { CheckLoginService } from "./services/checkLogin.service";
import { BlockTicketDetailsService } from "./services/blockTicketDetails.service";
import { AuthService } from "./services/auth.service";
import { TooltipModule } from 'primeng/tooltip';
import { FollowService } from "./services/follow.service";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    GallaryComponent,
    ProductComponent,
    Food_DrinkComponent,
    HomeComponent,
    ShoppingComponent,
    Enter_learnComponent,
    ProductComponent,
    AboutComponent,
    NewsComponent,
    GallaryComponent,
    FeedbackComponent,
    HomeCinemaComponent,
    BuyTicketComponent,
    TicketDetailsComponent,
    MovieDetailsComponent,
    ChatComponent,
    Login_SignupComponent,
    VerifyAccountComponent,
    ForgotPasswordComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DropdownModule,
    EditorModule,
    RatingModule,
    ButtonModule,
    FieldsetModule,
    InputTextModule,
    RatingModule,
    ToastModule,
    InputNumberModule,
    NgxPayPalModule,
    QRCodeModule,
    BsDatepickerModule.forRoot(),
    AutoCompleteModule,
    DialogModule,
    TooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ShopAPIService,
    BaseUrlService,
    ProductAPIService,
    GallaryAPIService,
    FeedbackAPIService,
    MessageService,
    ConfirmationService,
    ShowAPIService,
    TicketAPIService,
    DatePipe,


    //////////////////////
    MovieService,
    ShowTimeService,
    ComboService,
    BookingService,
    PaymentService,
    CinemaService,
    ChatService,
    AccountService,
    RssService,
    RatingService,
    CheckLoginService,
    BlockTicketDetailsService,
    AuthService,
    FollowService
  
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
