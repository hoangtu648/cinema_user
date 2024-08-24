import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Movie } from 'src/app/models/movie.model';
import { Payment, TicketDetail } from 'src/app/models/payment.model';
import { MovieService } from 'src/app/services/movie.service';
import { PaymentService } from 'src/app/services/payment.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe } from "@angular/common";
import { ShowTimeService } from 'src/app/services/showTime.service';
import { ShowTime } from 'src/app/models/showtime.model';
import { Cinema } from 'src/app/models/cinema.model';
import * as moment from 'moment';
import { CinemaService } from 'src/app/services/cinema.service';
import { CommonModule } from '@angular/common';
import { RatingService } from 'src/app/services/rating.service';
import { Account } from 'src/app/models/account.model';
import { MovieRatings } from 'src/app/models/movieRatings.model';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/app/services/account.service';

@Component({
  templateUrl: './movie_details.component.html',
  styleUrls: ['./movie_details.component.css']
})
export class MovieDetailsComponent implements OnInit{

  todayDate1: Date = new Date();
  todayDate2: Date = new Date();
  todayDate3: Date = new Date();
  todayDate4: Date = new Date();
  todayDate5: Date = new Date();
  todayDate6: Date = new Date();
  todayDate7: Date = new Date();
  date1: number;
  date2: number;
  date3: number;
  date4: number;
  date5: number;
  date6: number;
  date7: number;
  formattedReleaseDate: string;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private showTimeService: ShowTimeService,
    private cinemaService: CinemaService,
    private ratingService: RatingService,
    private messageService: MessageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
  ){}
    movieId: number;
    movie: Movie;
    movies: Movie[];
    seatNames: string;
    trailerUrl: SafeResourceUrl;
    dateSelected: Date;
    cinemas: Cinema[];
    cinemaId: number = 0;
    dateSelectedString: string;
    hoursString: string;
    comments: { userName: string, text: string, rating: number }[] = [];
    ratingNumber: number;
    rating: MovieRatings;
    account: Account;
    accountUsername: string = null;
    listComment: MovieRatings[];
    starsArray: number[] = [1, 2, 3, 4, 5];
    averageStars: number;
    filledStars: number[] = [];
    halfFilledStarIndex: number = -1;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
        const showIdParam = params["movieId"];
        this.movieId = showIdParam;
     
      });

      this.date1 = this.todayDate1.setDate(this.todayDate1.getDate() + 0);
      this.date2 = this.todayDate2.setDate(this.todayDate2.getDate() + 1);
      this.date3 = this.todayDate3.setDate(this.todayDate3.getDate() + 2);
      this.date4 = this.todayDate4.setDate(this.todayDate4.getDate() + 3);
      this.date5 = this.todayDate5.setDate(this.todayDate5.getDate() + 4);
      this.date6 = this.todayDate6.setDate(this.todayDate6.getDate() + 5);
      this.date7 = this.todayDate7.setDate(this.todayDate7.getDate() + 6);
  
  
  
      this.dateSelected = this.todayDate1;
      this.dateSelectedString = this.datePipe.transform(this.dateSelected, 'dd/MM/yyyy');
      // Tìm thông tin phim dựa vào id
      this.movieService.findMovieById(this.movieId).then(
        (response) => {
            this.movie = response as Movie;
            console.log(this.movie.releaseDate);
            this.formattedReleaseDate = this.datePipe.transform(
              this.parseDate(this.movie.releaseDate),
              'dd/MM/yyyy'
            );
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.trailer);
        },
        (err) => {

        }
      );

      // Tìm xuất chiếu của phim đó theo từng rạp
      this.cinemaService.findAll().then(
        (res) => {
            this.cinemas = res as Cinema[];
            this.cinemaId = this.cinemas[0].id;
            console.log(this.cinemaId);
            this.movieService.findMovie(this.dateSelectedString, this.cinemaId, this.movieId).then(
              (res) => {
                this.movies = res as Movie[];
                console.log(res);
                console.log(this.dateSelectedString);
                this.movies.forEach(m => {
                  // Sử dụng Map để đảm bảo showtimes với subId và subName duy nhất
                  const uniqueShowtimes = new Map<number, ShowTime>();
            
                  m.showtimes.forEach(s => {
                    if (!uniqueShowtimes.has(s.subId)) {
                      uniqueShowtimes.set(s.subId, s);
                    }
                  });
            
                  // Chỉ giữ lại showtimes duy nhất
                  m.subs = Array.from(uniqueShowtimes.values());
                  
                });
             
              },
              (err) => {
                console.error(err);
              }
            );
        },
        (err) => {
          console.error(err);
        }
      );
     
      this.account = JSON.parse(localStorage.getItem('account'));
      if(this.account) {
        this.accountUsername = this.account.username;
      }

      this.ratingService.findAll(this.movieId).then(
        (res) => {
           this.listComment = res.status as MovieRatings[];
           console.log(this.listComment);
        },

      )

      this.ratingService.avg(this.movieId).then(
        (res) => {
           this.averageStars = res.status as number;
           this.calculateStarDisplay();
        },

      )
    }

    calculateStarDisplay(): void {
      this.filledStars = Array(Math.floor(this.averageStars)).fill(0);
      const decimalPart = this.averageStars % 1;
  
      if (decimalPart > 0) {
        this.halfFilledStarIndex = Math.floor(this.averageStars);
      } else {
        this.halfFilledStarIndex = -1;
      }
    }
    selectCinema(evt: any){
      this.cinemaId = evt.target.value;
      console.log(this.cinemaId);
      this.movieService.findMovie(this.dateSelectedString, this.cinemaId, this.movieId).then(
        (res) => {
        
          console.log(this.dateSelectedString);
          this.movies = res as Movie[];
          this.movies.forEach(m => {
            // Sử dụng Map để đảm bảo showtimes với subId và subName duy nhất
            const uniqueShowtimes = new Map<number, ShowTime>();
      
            m.showtimes.forEach(s => {
              if (!uniqueShowtimes.has(s.subId)) {
                uniqueShowtimes.set(s.subId, s);
              }
            });
      
            // Chỉ giữ lại showtimes duy nhất
            m.subs = Array.from(uniqueShowtimes.values());
            console.log(m.subs);
          });
          console.log(this.movies);
        },
        (err) => {
          console.error(err);
        }
      );
    }
    check(evt: any) {
      var value: any = evt.target.value;
      
      console.log("checkkkkkkkkkkkkk", value);
      this.dateSelectedString = value;
      this.movieService.findMovie(value, this.cinemaId, this.movieId).then(
        (res) => {
          this.movies = res as Movie[];
          this.movies.forEach(m => {
            // Sử dụng Map để đảm bảo showtimes với subId và subName duy nhất
            const uniqueShowtimes = new Map<number, ShowTime>();
      
            m.showtimes.forEach(s => {
              if (!uniqueShowtimes.has(s.subId)) {
                uniqueShowtimes.set(s.subId, s);
              }
            });
      
            // Chỉ giữ lại showtimes duy nhất
            m.subs = Array.from(uniqueShowtimes.values());
            console.log(m.subs);
          });
          console.log(this.movies);
        },
        (err) => {
          console.error(err);
        }
      );
    }

    parseDate(dateString: string): Date {
      // Chuyển đổi chuỗi ngày từ định dạng dd/MM/yyyy HH:mm:ss thành đối tượng Date
      const [day, month, year] = dateString.split(' ')[0].split('/').map(Number);
      return new Date(year, month - 1, day); // Ngày tháng trong JavaScript bắt đầu từ 0 (tháng 0 = tháng 1)
    }  

  convertDateToString(date: Date) {
    const formattedDate = moment(date).format("DD-MM-YYYY");
    console.log("AAAAAAAAAAAAAAAAAAAAa", formattedDate);
    return formattedDate;
  }
   // Phương thức để cắt chuỗi showDate
   getFormattedDate(date: string): string {
    return date.split(' ')[1]; // Cắt lấy phần dd/MM/yyyy
  }

  checkHours(hours: string): boolean{
    this.hoursString = this.datePipe.transform(this.todayDate1, 'dd/MM/yyyy HH:mm');
    return this.hoursString > hours;
  }

  submitComment(event: Event) {
    event.preventDefault();
    console.log(this.account);
    const form = event.target as HTMLFormElement;
    const userName = (form.querySelector('#userName') as HTMLInputElement).value;
    const userComment = (form.querySelector('#userComment') as HTMLTextAreaElement).value;
    const ratingInput = form.querySelector('input[name="rating"]:checked') as HTMLInputElement;
    const rating = ratingInput ? parseInt(ratingInput.value, 10) : 0;
    this.ratingNumber = rating;
    if(this.account) {
      this.accountUsername = this.account.username;
       this.rating = {
          id: 0,
          comment: userComment,
          movieId:  this.movieId,
          accountId: this.account.id,
          rate: this.ratingNumber
      }
      if (userName && userComment && rating) {
        this.comments.push({ userName, text: userComment, rating });
        

         this.messageService.add({
          severity: "success",
          summary: "Bình luận thành công",
          detail: "Bạn đã bình luận thành công. Cảm ơn bạn đã đóng góp ý kiến."
        });
        this.ratingService.create(this.rating).then(
          (res) => {
            this.ratingService.findAll(this.movieId).then(
              (res) => {
                console.log(res);
                this.listComment = res.status as MovieRatings[];
              }
            );
          }
        )
        this.cdr.detectChanges();
        if (ratingInput) {
          ratingInput.checked = false; // Bỏ chọn tất cả các đánh giá
      }
      (form.querySelector('#userComment') as HTMLTextAreaElement).value = "";
    
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Bình luận thất bại",
        detail: "Bạn cần có tài khoản để thực hiện chức năng bình luận."
      });
    }
  }

  getStars(rating: number) {
    return new Array(rating).fill(this.ratingNumber);
  }

}