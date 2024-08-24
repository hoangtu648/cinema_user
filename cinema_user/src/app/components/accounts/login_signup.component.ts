import { AccountService } from './../../services/account.service';
import { ChangeDetectorRef, Component, ElementRef, OnInit, AfterViewInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Account, AccountLogin } from 'src/app/models/account.model';
import { AuthService } from 'src/app/services/auth.service';
import {jwtDecode} from 'jwt-decode';
declare let google: any;
// Các trường dữ liệu sau khi mã hóa jwt thì sẽ cho ra các thông tin
interface DecodedToken {
  sub: string; 
  email: string; 
  name: string;
}
@Component({
  templateUrl: './login_signup.component.html',
  styleUrls: ['./login_signup.component.css'],
})
export class Login_SignupComponent implements OnInit, AfterViewInit  {
  signupForm: FormGroup;
  loginForm: FormGroup;
  randomNumber = Math.floor(100000 + Math.random() * 900000);
  newAccount: Account;
  account: Account;
  authenticatedAccount: boolean;

  constructor(
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private authService: AuthService,
  ) {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      birthday: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });

    this.loginForm = this.formBuilder.group({
      emailLogin: ['', [Validators.required, Validators.email]],
      passwordLogin: ['', Validators.required],
    })
  }
  ngAfterViewInit(): void {
    this.loadGoogleSignIn();
  }

  async signUp(): Promise<void> {
    // Kiểm tra mật khẩu xác nhận
    if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
      this.messageService.add({
        severity: "error",
        summary: "Xác nhận lại mật khẩu",
        detail: "Mật khẩu xác nhận không trùng với mật khẩu bạn tạo. Vui lòng nhập lại"
      });
      console.log(1);
      return; // Ngăn không cho tiếp tục nếu mật khẩu không khớp
    }

    // Kiểm tra tính hợp lệ của form
    if (!this.signupForm.valid) {
      this.messageService.add({
        severity: "error",
        summary: "Đăng kí thất bại",
        detail: "Vui lòng nhập đầy đủ thông tin"
      });
      console.log(2);
      return; // Ngăn không cho tiếp tục nếu biểu mẫu không hợp lệ
    }

    // Định dạng ngày sinh
    const birthday = this.signupForm.value.birthday;
    console.log(birthday);
    const formattedBirthday = moment(birthday).format('DD/MM/YYYY HH:mm:ss');
    console.log(formattedBirthday);
    // Khởi tạo đối tượng newAccount
    this.newAccount = { 
      id: 0,
      username: this.signupForm.value.username,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      phone: this.signupForm.value.phone,
      gender: this.signupForm.value.gender,
      birthday: formattedBirthday,
      securitycode: this.randomNumber.toString(), 
      verify: 0 
    };

    try {
      // Tạo tài khoản
      await this.accountService.create(this.newAccount);


      this.account = await this.accountService.findByEmail(this.newAccount.email);

      // Lưu tài khoản vào localStorage
      localStorage.setItem('account', JSON.stringify(this.account));

      

      // Chuẩn bị nội dung email
      const emailContent = `
        <p>Chào bạn,</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhấp vào liên kết dưới đây để xác nhận tài khoản của bạn:</p>
        <a href='http://localhost:4200/verify-account?email=${encodeURIComponent(this.newAccount.email)}'>Xác nhận tài khoản</a>
      `;

      // Gửi email xác thực
      console.log(this.newAccount.email);
      const email = {
        from: 'atun123456789cu@gmail.com',
        to: this.newAccount.email,
        subject: 'Xác thực tài khoản',
        content: emailContent
      };
      this.accountService.sendMail(email).then(
        (res) => {
          console.log(res);
        }
      );

      // Chuyển hướng đến trang home sau khi gửi email
      this.messageService.add({
        severity: "info",
        summary: "Gửi xác nhận về mail",
        detail: "Bạn đã tạo tài khoản thành công. Sẽ có 1 email để bạn xác thực tài khoản."
      });
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
    }
  }

  async login(): Promise<void> {
    if (!this.loginForm.valid) {
      this.messageService.add({
        severity: "error",
        summary: "Đăng nhập thất bại",
        detail: "Bạn vui lòng nhập đầy đủ thông tin"
      });
      return; // Ngăn không cho tiếp tục nếu biểu mẫu không hợp lệ
    }
  
    const loginAccount: AccountLogin = {
      email: this.loginForm.value.emailLogin,
      password: this.loginForm.value.passwordLogin,
    };
  
    try {
      const res = await this.accountService.login(loginAccount);
  
      if (res.status) {
        const accountResponse = await this.accountService.findByEmail(loginAccount.email);
        this.account = accountResponse as Account;
        localStorage.setItem('account', JSON.stringify(this.account));
  
        this.messageService.add({
          severity: "success",
          summary: "Đăng nhập thành công",
          detail: "Đăng nhập thành công"
        });
  
        // Redirect to home page after a brief delay
        this.router.navigate(['/profile']);
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Đăng nhập thất bại",
          detail: "Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập của bạn."
        });
  
        // Redirect to login page after a brief delay
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 4000);
      }
    } catch (error) {
      console.error('Login error:', error);
      this.messageService.add({
        severity: "error",
        summary: "Đăng nhập thất bại",
        detail: "Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập của bạn."
      });
  
      // Redirect to login page after a brief delay
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 4000);
    }
  }
  

  ngOnInit(): void {
    // Thực hiện các thao tác khởi tạo khi component được tạo
 
  }

  togglePasswordVisibility(event: Event): void {
    const eyeIcon = event.target as HTMLElement;
    const pwFieldContainer = eyeIcon.closest('.input-field');
    const pwFields = pwFieldContainer?.querySelectorAll('.password');

    if (pwFields) {
      pwFields.forEach((passwordField: HTMLInputElement) => {
        if (passwordField.type === 'password') {
          passwordField.type = 'text';
          eyeIcon.classList.replace('bx-hide', 'bx-show');
        } else {
          passwordField.type = 'password';
          eyeIcon.classList.replace('bx-show', 'bx-hide');
        }
      });
    }
  }

  toggleSignUp(event: Event): void {
    event.preventDefault(); // Ngăn chặn việc gửi biểu mẫu
    const forms = this.el.nativeElement.querySelector('.forms');
    forms.classList.toggle('show-signup');
  }

  

  loadGoogleSignIn() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeGoogleSignIn();
    };
    document.head.appendChild(script);
  }

  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: '1068481455291-8tphofai5e6upm60k5c7bf6a5acopruo.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this)
    });

    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        type: "standard", theme: "outline",
        size: "large", width: "350", shape: "pill", ux_mode: "popup",
        }
    );

    google.accounts.id.renderButton(
      document.getElementById('google-login-button'),
      {
        type: "standard", theme: "outline",
        size: "large", width: "350", shape: "pill", ux_mode: "popup",
        }
    );
  }

  handleCredentialResponse(response: any) {
    if (response && response.credential) {
      const idToken = response.credential;
      this.authService.googleRegister(idToken).subscribe(
        res => {
          const decoded: DecodedToken = jwtDecode(idToken);
          console.log('Decoded token:', decoded);
          this.accountService.findByEmail(decoded.email).then(
             (res) => {
                  if (res) {
                    const accountGoogle: Account = {
                        id: res.id,
                        username: decoded.name,
                        email: decoded.email,
                        password: res.password,
                        phone: res.phone,
                        gender: res.gender,
                        birthday: res.birthday,
                        securitycode: res.securitycode,
                        verify: 1
                    };

                    this.accountService.setAccount(accountGoogle);
                    
                } else {
                }
             }
          )
          this.messageService.add({
            severity: 'success',
            summary: 'Đăng kí thành công',
            detail: 'Bạn đã đăng kí thành công bằng Google.'
          });
          
          this.router.navigate(['/profile']);
        },
        err => {
          console.error('Login failed', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Đăng nhập thất bại',
            detail: 'Có lỗi xảy ra khi đăng nhập.'
          });
        }
      );
    } else {
      console.error('No credential received');
    }
  }

 
  
}
