import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GallaryComponent } from "./components/gallary/gallary.component";
import { ProductComponent } from "./components/product/product.component";
import { Food_DrinkComponent } from "./components/food-drink/food_drink.component";
import { HomeComponent } from "./components/home/home.component";
import { ShoppingComponent } from "./components/shopping/shopping.component";
import { Enter_learnComponent } from "./components/enter_learn/enter_learn.component";
import { AboutComponent } from "./components/about/about.component";
import { NewsComponent } from "./components/news/news.component";
import { FeedbackComponent } from "./components/feedback/feedback.component";
import { HomeCinemaComponent } from "./components/Cinema home/homecinema.component";
import { BuyTicketComponent} from "./components/Buy ticket/buy_ticket.component";
import { TicketDetailsComponent } from "./components/Ticket details/ticket_details.component";
import { MovieDetailsComponent } from "./components/Movie details/movie_details.component";
import { DatePipe } from "@angular/common";
import { ChatComponent } from "./components/Chat/chat.component";
import { Login_SignupComponent } from "./components/accounts/login_signup.component";
import { PricingComponent } from "./components/price_ticket/pricing.component";
import { VerifyAccountComponent } from "./components/verify/verify-account.component";
import { ForgotPasswordComponent } from "./components/forgot_password/forgot_pass.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { CheckLoginService } from "./services/checkLogin.service";
import { BlockTicketDetailsService } from "./services/blockTicketDetails.service";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "home",
    component: HomeComponent,
  },
  {
    path: "product",
    component: ProductComponent,
  },
  {
    path: "food-drink",
    component: Food_DrinkComponent,
  },
  {
    path: "rss-movie",
    component: ShoppingComponent,
  },
  {
    path: "entertainment-learning",
    component: Enter_learnComponent,
  },
  {
    path: "about",
    component: AboutComponent,
  },
  {
    path: "gallery",
    component: GallaryComponent,
  },
  {
    path: "news",
    component: NewsComponent,
  },

  {
    path: "feedback",
    component: FeedbackComponent,
  },
  {
    path: "cinema",
    component: HomeCinemaComponent,
  },
  {
    path: "buy-ticket/:showId",
    component: BuyTicketComponent,
  },
  ,
  {
    path: "ticket-details/:paymentId",
    component: TicketDetailsComponent,
    canActivate: [BlockTicketDetailsService]
  },
  {
    path: "movie-details/:movieId",
    component: MovieDetailsComponent,
  
  },
  ,
  {
    path: "chat",
    component: ChatComponent,
    canActivate: [CheckLoginService]
  },
  {
    path: "login",
    component: Login_SignupComponent,
  },
  {
    path: "pricing",
    component: PricingComponent,
  },
  {
    path: "verify-account",
    component: VerifyAccountComponent,
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "profile",
    component: ProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
