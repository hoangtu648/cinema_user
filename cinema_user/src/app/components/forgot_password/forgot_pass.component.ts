import { Account, AccountUpdatePassword } from 'src/app/models/account.model';
import { AccountService } from './../../services/account.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: './forgot_pass.component.html',
  styleUrls: ['./forgot_pass.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy{
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  isVerificationSent: boolean = false;
  verifyCode: string = '';
  expiredCode: Date;
  accountUpdated: Account;
  private countdownTime = 5 * 60 * 1000; // 5 phút
  timeLeft: string = '';
  private timerSubscription: Subscription;
    constructor(private accountService: AccountService, private router: Router, private messageService: MessageService) {
        
    }
  ngOnInit(): void {
   
  }
  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private startCountdown() {
    const endTime = Date.now() + this.countdownTime;
    this.timerSubscription = interval(1000).subscribe(() => {
      const now = Date.now();
      const timeRemaining = endTime - now;
      
      if (timeRemaining <= 0) {
        this.timeLeft = '00:00';
        this.timerSubscription.unsubscribe();
      } else {
        const minutes = Math.floor((timeRemaining % (1000 * 3600)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        this.timeLeft = `${this.pad(minutes)}:${this.pad(seconds)}`;
      }
    });
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }


  // Gọi hàm gửi mã xác thực
  sendVerificationEmail(): void {
    if (this.email) {
      // Gửi email với mã xác thực (thực hiện gọi API ở đây)
      console.log(`Gửi mã xác thực đến ${this.email}`);
      this.accountService.findByEmail(this.email).then(
        (res) => {
          console.log(res);
            if(res != null) {
                const code = Math.floor(100000 + Math.random() * 900000).toString(); // Mã 6 chữ số
                const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút
                // const expiresAt = new Date(Date.now() + 10 * 1000); // 10 seconds
                const emailContent =  `Mã xác nhận của bạn là ${code}. Mã sẽ hết hạn sau 5 phút.`;
                this.verifyCode = code;
                this.expiredCode = expiresAt;
                var account = res as Account;
                this.accountUpdated = res;
                  // Gửi email xác thực
                const email = {
                    from: 'atun123456789cu@gmail.com',
                    to: account.email,
                    subject: 'Xác thực tài khoản',
                    content: emailContent
                };
                this.accountService.sendMail(email);
                this.isVerificationSent = true; // Hiển thị form nhập lại mật khẩu
                this.startCountdown();
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Thất bại",
                detail: "Email không tồn tại. Vui lòng xác nhận lại."
              });
                this.router.navigate(['/forgot-password']);
            }
        },
        (err) => {
          this.messageService.add({
            severity: "error",
            summary: "Thất bại",
            detail: "Email không tồn tại. Vui lòng xác nhận lại."
          });
            this.router.navigate(['/forgot-password']);
        }
      )
    }
  }


  // Gọi hàm đặt lại mật khẩu
  resetPassword(): void {
    if (this.verificationCode && this.newPassword) {
        if(this.verificationCode === this.verifyCode && this.expiredCode && new Date() < this.expiredCode) {
            var account : Account = {
                id: this.accountUpdated.id,
                username: this.accountUpdated.username,
                password: this.newPassword,
                email: this.accountUpdated.email,
                phone: this.accountUpdated.phone,
                gender: this.accountUpdated.gender,
                birthday: this.accountUpdated.birthday,
                securitycode: this.accountUpdated.securitycode,
                verify: 1
            }
            this.accountService.update(account).then(
                (res) => {
                  this.messageService.add({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Cập nhật mật khẩu thành công"
                  });
                    this.router.navigate(['/login']);
                },
                (err) => {
                  this.messageService.add({
                    severity: "error",
                    summary: "Thất bại",
                    detail: "Cập nhật mật khẩu thất bại"
                  });
                    this.router.navigate(['/login']);
                }
            )
        } else {
            alert("Cập nhật mật khẩu thất bại");
            this.router.navigate(['/login']);
        }
      // Xác thực mã và đặt lại mật khẩu (thực hiện gọi API ở đây)
      console.log(`Xác thực mã: ${this.verificationCode}`);
      console.log(`Đặt lại mật khẩu mới: ${this.newPassword}`);
      // Reset các trường
      this.email = '';
      this.verificationCode = '';
      this.newPassword = '';
      this.isVerificationSent = false;
    }
  }


}
