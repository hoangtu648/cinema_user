import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ShowDetail } from "src/app/models/show.model";
import { ShowAPIService } from "src/app/services/showAPI.service";
import * as moment from "moment";
import { TicketAddPost } from "src/app/models/ticket.model";
import { TicketAPIService } from "src/app/services/ticketAPI.service";
import { MessageService } from "primeng/api";
import { ShowTimeService } from "src/app/services/showTime.service";
import { ShowTimeDetails } from "src/app/models/showtime.model";
import { ComboService } from "src/app/services/combo.service";
import { Combo, ComboDetails } from "src/app/models/combo.model";
import { Booking, BookingDetails } from "src/app/models/booking.model";
import { BookingService } from "src/app/services/booking.service";
import { ICreateOrderRequest, IPayPalConfig } from "ngx-paypal";
import { PaymentService } from "src/app/services/payment.service";
import { Payment, PaymentRequest } from "src/app/models/payment.model";
import { DatePipe } from "@angular/common";
import { VNPay, OnePayDomestic, OnePayInternational, SohaPay, NganLuong } from 'vn-payments';
@Component({
  templateUrl: "./buy_ticket.component.html",
  styleUrls: ['./ticket-booking.component.css']
})
export class BuyTicketComponent {
  rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  seats: number[] = Array.from({ length: 15 }, (_, i) => i + 1);
  doubleSeats: number[][] = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10],[11, 12],[13, 14]];

  // Lưu trạng thái của các ghế, khởi tạo tất cả là chưa được đặt (false)
  seatStatus: { [key: string]: boolean } = {};
  seatBooked: { [key: string]: boolean } = {};
  selectedSeats1: string = '';
  orderId = Math.floor(100000 + Math.random() * 900000);; // ID đơn hàng
  amount: number; // Số tiền cần thanh toán
  maxSelectedSeats: number = 10;
  constructor(
    private route: ActivatedRoute,
    private showAPIService: ShowAPIService,
    private formBuilder: FormBuilder,
    private ticketAPIService: TicketAPIService,
    private messageService: MessageService,
    private router: Router,
    private showTimeService: ShowTimeService,
    private comboService: ComboService,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private datePipe: DatePipe
  ) {}
  todayDate: Date = new Date();
  showDetail: ShowTimeDetails;
  showId: string;
  selectedSeat: { row: number, col: number } | null = null;
  selectedSeats: Set<string> = new Set();
  combos: Combo[];
  selectedCombo: Combo;
  comboNumber: number;
  ticketForm: FormGroup;
  comboId: number = -1;
  comboDetails: ComboDetails[];
  payPalConfig: IPayPalConfig;
  lastElementsArray = [];
  visible: boolean = false;
  total: number = 0;
  listSeatBooked = [];
  ngOnInit() {
    this.route.params.subscribe((params) => {
      const showIdParam = params["showId"];
      this.showId = showIdParam;
    });
    this.showTimeService.checkSeat(Number(this.showId)).then(
      (res) => {
        // Kiểm tra nếu có dữ liệu bookings
        if (res.bookings && Array.isArray(res.bookings)) {
          res.bookings.forEach(booking => {
            if (booking.bookingDetails && Array.isArray(booking.bookingDetails)) {
              booking.bookingDetails.forEach(detail => {
                this.listSeatBooked.push(detail.seatName);
                
              });
            }
          });
          this.rows.forEach(row => {
            if (row !== 'H') {
              this.seats.forEach(seat => {
                this.seatBooked[`${row}${seat}`] = false;
                this.listSeatBooked.forEach((value) => {
                  if(value == `${row}${seat}`){
                    this.seatBooked[`${row}${seat}`] = true;
                  } // In ra từng giá trị: "A2", "A1", "A4"
                });
              });
              
            } else {
              this.doubleSeats.forEach(pair => {
                this.seatStatus[`H${pair[0]}`] = false;
               
                this.listSeatBooked.forEach((value) => {
                  if(value.includes('-')){
                    if(value.split('-')[0] == `H${pair[0]}`){
                      console.log(`H${pair[0]}`);
                      this.seatBooked[`H${pair[0]}`] = true;
                    }
                  }
                  // if(value.split('-')[0] == `H${pair[0]}`){
                  //   this.seatBooked[`H${pair[0]}`] = true;
                  // } // In ra từng giá trị: "A2", "A1", "A4"
                });
              });
            }
            
          });
        
        }
      },
      (err) => {
        console.log(err);
      }
    );

      this.payPalConfig = {
          currency: 'USD',
          clientId: 'sb',
          createOrderOnClient: (data) => < ICreateOrderRequest > {
              intent: 'CAPTURE',
              purchase_units: [{
                  amount: {
                      currency_code: 'USD',
                      value: this.total.toString(),
                      breakdown: {
                          item_total: {
                              currency_code: 'USD',
                              value: this.total.toString()
                          }
                      }
                  },
                  items: [{
                      name: 'Enterprise Subscription',
                      quantity: '1',
                      category: 'DIGITAL_GOODS',
                      unit_amount: {
                          currency_code: 'USD',
                          value: this.total.toString(),
                      },
                  }]
              }]
          },
          advanced: {
              commit: 'true'
          },
          style: {
              label: 'paypal',
              layout: 'vertical'
          },
          onApprove: (data, actions) => {
              console.log('onApprove - transaction was approved, but not authorized', data, actions);
              actions.order.get().then(details => {
                  console.log('onApprove - you can get full order details inside onApprove: ', details);
              });

          },
          onClientAuthorization: (data) => {
              console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
              console.log(data.status);
              if(data.status == 'COMPLETED'){
                var booking: Booking =  this.ticketForm.value as Booking;

    console.log(booking);
    console.log(this.selectedSeats1);
    var seats = this.selectedSeats1.split(', ');
    console.log(seats);
    
    this.bookingService.create(booking).then(
      (result) => {
        console.log(result.status);
        console.log(result.id);
       
        seats.forEach((value, index) => {
         
          this.bookingService.findSeatByName(value).then(
            (res) => {
              
               var bookingDetails: BookingDetails = {
              bookingId: result.id,
              seatId: res.id
            };
            this.bookingService.createBookingDetails(bookingDetails).then(
              (response) => {
                  this.total += res.price;
              },
              (err) => {

              }
            );
            console.log(bookingDetails);
            },
            (err) => {

            }

          );
           
        });
        if(this.lastElementsArray.length > 0){
          this.lastElementsArray.forEach((value) => {
              value.bookingId = result.id;
              this.comboService.createComboDetails(value).then(
                (response) => {
                    
                },
                (err) => {
  
                }
              );
          });
        }
        var randomNumber = Math.floor(100000 + Math.random() * 900000);
        var payment : Payment= {
          bookingId: result.id as number,
          paymentType: 1,
          transactionNo: data.id,
          ticketNumber: randomNumber,
          qr: randomNumber.toString(),
          description: "Thanh toán vé xem phim",
          price: this.total
        };
        console.log('payment: ' + payment);
        this.paymentService.create(payment).then(
          (response) => {
            var email = {
              from : 'atun123456789cu@gmail.com',
              to: booking.email,
              subject: 'Xác nhận đặt vé thành công',
              content: 'Mã vé của bạn là ' + randomNumber
            }
            this.paymentService.sendMail(email).then(
              
            );
            this.paymentService.sendSMS('Mã vé của bạn là: ' + randomNumber).then();
            this.messageService.add({
              severity: "success",
              summary: "Thành công",
              detail: "Mua vé thành công, đang chuyển hướng tới trang chi tiết vé"
            });
            this.paymentService.paymentService(true);
            setTimeout(() => {
              this.router.navigate(['/ticket-details', response.id]);
            }, 4000);
          },
          (err) => {
            console.log(err);
          }
        );
        
       

        
      },
      (err) => {
        console.log(err);
      }
    );
   } else {
    this.messageService.add({
      severity: "error",
      summary: "Vui lòng nhập đủ thông tin",
      detail: "Lỗi"
    });
              }
          },
          onCancel: (data, actions) => {
              console.log('OnCancel', data, actions);
          

          },
          onError: err => {
              console.log('OnError', err);
             
          },
          onClick: (data, actions) => {
              console.log('onClick', data, actions);
              
          }
      };
    
     

      
    this.checkShow();
    this.showTimeService.findById(Number(this.showId)).then(
      (res) => {
        this.showDetail = res as ShowTimeDetails
      
      },
      (err) => {
        console.log(err);
      }
    );
    this.comboService.findAll().then(
      (res) => {
        this.combos = res as Combo[];
    
       
      },
      (err) => {
        console.log(err);
      }
    );
    this.ticketForm = this.formBuilder.group({
      name: ['', Validators.required], // Thêm Validators.required
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]], // Thêm Validators.required và pattern
      email: ['', [Validators.required, Validators.email]], // Thêm Validators.required và email
      showTimeId: this.showId
    });
    this.comboDetails = [];
  }

  // isSeatSelected(seat: string): boolean {
  //   return this.selectedSeats.has(seat);
  // }
  // Hàm xử lý khi nhấp vào ghế
  selectSeat(row: number, col: number): void {
    const rowLabels = ['A', 'B', 'C', 'D', 'E'];
    this.selectedSeat = { row, col };
    console.log(`Selected Seat: Row ${rowLabels[col]}, Column  ${row + 1}`);
  }

  // Get the CSS class based on seat status

  convertDateToString(date: Date) {
    const formattedDate = moment(date).format("DD/MM/YYYY");

    return formattedDate;
  }
  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });

  }
  
  toggleSeat(seatId: string): void {
    this.seatStatus[seatId] = !this.seatStatus[seatId];

    if (seatId.startsWith('H')) {
      const seatNumber = parseInt(seatId.substring(1), 10);
      const pairSeatNumber = this.doubleSeats.find(pair => pair.includes(seatNumber))?.find(seat => seat !== seatNumber);
      if (pairSeatNumber !== undefined) {
        this.seatStatus[`H${pairSeatNumber}`] = this.seatStatus[seatId];
      }
    }

    this.updateSelectedSeats();
  }

  isSeatSelected(seatId: string): boolean {
    // Trả về trạng thái hiện tại của ghế (đã đặt hoặc chưa)
    return this.seatStatus[seatId];
  }

  isBooked(seatBooked: string): boolean {
    return this.seatBooked[seatBooked];
  }

  getSelectedSeats(): string[] {
    const selectedSeats: string[] = [];
  
    Object.keys(this.seatStatus).forEach(seatId => {
      if (this.seatStatus[seatId]) {
        if (seatId.startsWith('H')) {
          const seatNumber = parseInt(seatId.substring(1), 10);
          const pairSeatNumber = this.doubleSeats.find(pair => pair.includes(seatNumber))?.find(seat => seat !== seatNumber);
          const pairSeatId = `H${pairSeatNumber}`;
  
          // Kiểm tra nếu cặp ghế đôi này chưa được thêm vào danh sách
          if (!selectedSeats.includes(`${seatId}-${pairSeatId}`) && !selectedSeats.includes(`${pairSeatId}-${seatId}`)) {
            selectedSeats.push(`${seatId}-${pairSeatId}`);
          }
        } else {
          selectedSeats.push(seatId);
        }
      }
    });
  
    return selectedSeats;
  }

  updateSelectedSeats(): void {
    this.selectedSeats1 = this.getSelectedSeats().join(', ');
  }
  selectCombo(evt: any){
    console.log(evt.target.value);
    this.comboId = evt.target.value;
  }
  buyTicket(){
    
    if (this.ticketForm.valid && this.selectedSeats1 !== '') {
      this.visible = true;
    
      // Split the seats into an array and sort by row letters and seat numbers.
      let seats = this.selectedSeats1.split(', ');
      console.log("Các ghế đã đặt: ", seats);
    
      let seatsArray = seats.map(seat => {
        return {
          row: seat.charAt(0),
          number: parseInt(seat.slice(1), 10)
        };
      });
    
      seatsArray.sort((a, b) => {
        if (a.row === b.row) {
          return a.number - b.number;  
        } else {
          return a.row.localeCompare(b.row); 
        }
      });
    
      console.log("Sorted Seats Array: ", seatsArray);
    
      for (let i = 0; i < seatsArray.length - 1; i++) {
        if (seatsArray[i].row === seatsArray[i + 1].row) {
          let difference = seatsArray[i + 1].number - seatsArray[i].number;
          console.log("Difference: ", difference);
          if (difference >= 2) {
            this.visible = false;
            this.messageService.add({
              severity: "error",
              summary: "Đặt vé thất bại",
              detail: "Bạn vui lòng chọn ghế không cách quá 1 ghế. Vui lòng bạn chọn lại ghế"
            });
            return;
          }
        } else {
          this.visible = false;
          this.messageService.add({
            severity: "error",
            summary: "Đặt vé thất bại",
            detail: "Bạn vui lòng chọn ghế không cách quá 1 ghế. Vui lòng bạn chọn lại ghế"
          });
          return;
        }
      }
    
      if (seatsArray.length > this.maxSelectedSeats) {
        this.visible = false;
        this.messageService.add({
          severity: "error",
          summary: "Đặt vé thất bại",
          detail: "Chỉ cho phép đặt tối đa 10 ghế trong 1 lần đặt vé."
        });
        return;
      }
    
      seatsArray.forEach((seat, index) => {
        this.bookingService.findSeatByName(seat.row + seat.number).then(
          (res) => {
            console.log(res.price);
            this.total += res.price;
            console.log(this.total);
          },
          (err) => {
          }
        );
      });
    
      if (this.lastElementsArray.length > 0) {
        this.lastElementsArray.forEach((value) => {
          this.total += (value.quantity * value.price);
        });
      }
    
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Đặt vé thất bại",
        detail: "Vui lòng nhập đủ thông tin"
      });
    }
    

  }
  onValueChange(evt: any, id: number, price: number){
    var quantity = evt.target.value;
   
    if (quantity >= 0) {
      this.comboDetails.push({ comboId: id, bookingId: null, quantity: quantity, price: price });
      console.log(this.comboDetails);
      
      const lastElementsMap = new Map<number, any>();
      this.comboDetails.forEach(element => {
        // Cập nhật hoặc thêm phần tử vào map với key là comboId
        lastElementsMap.set(element.comboId, element);
      });
    
      this.lastElementsArray = Array.from(lastElementsMap.values());
    
      // Loại bỏ các phần tử có quantity = 0
      this.lastElementsArray = this.lastElementsArray.filter(element => element.quantity > 0);
    
      console.log(this.lastElementsArray);
    }
   
  }
  checkShow(){
    this.showTimeService.findById(Number(this.showId)).then(
      (res) => {
        if(res.showDate < this.datePipe.transform(this.todayDate, 'dd/MM/yyyy')){
          this.router.navigate(['/cinema'], { queryParams: { status: false } });
        } else {
          
        }
 
      },
      (err) => {
        console.error(err);
      }
    );
  }


  onPay() {
    const amount = this.total;
    const orderInfo = this.orderId;
    const returnUrl = 'http://localhost:4200/home';
  
    const paymentRequest: PaymentRequest = {
      amount: Number(amount),
      orderInfo: orderInfo.toString(),
      returnUrl: returnUrl
    };
  
    this.paymentService.vnpay(paymentRequest).then(response => {
      console.log('Response:', response);
  
      if (response && response.PaymentUrl) {
        console.log('Redirecting to:', response.PaymentUrl);
        window.location.assign(response.PaymentUrl); // Chuyển hướng đến VNPay
      } else {
        console.error('Payment URL is undefined or invalid');
      }
    }).catch(error => {
      console.error('Error while initiating payment:', error);
    });
  }
  
 
}
