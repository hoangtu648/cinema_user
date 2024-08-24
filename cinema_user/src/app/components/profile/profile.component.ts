import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Account, AccountLogin } from "src/app/models/account.model";
import * as moment from 'moment';
import { AccountService } from "src/app/services/account.service";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
  })
export class ProfileComponent implements OnInit{
    updateForm: FormGroup;
    showCurrentPassword: boolean = false;
    showNewPassword: boolean = false;
    showConfirmPassword: boolean = false;
    formattedBirthday: string;

    constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router, private messageService: MessageService) {
      this.updateForm = this.fb.group({
        username: ['', Validators.required],
        currentPassword: [''],
        newPassword: [''],
        confirmPassword: [''],
        email: ['', [Validators.required, Validators.email]],
        birthday: ['', Validators.required],
        phone: ['', Validators.required],
        gender: ['', Validators.required],
      },{ validator: this.matchPassword('newPassword', 'confirmPassword') });
    }
    account: Account;

    ngOnInit(): void {
      this.accountService.getAccount().subscribe(account => {
        if (account) {
            this.account = account;
        } else {
            const accountData = localStorage.getItem('account');
            if (accountData) {
                this.account = JSON.parse(accountData);
            }
        }
    });
    }

    loadAccountData(): void {
      const accountData = localStorage.getItem('account');
      if (accountData) {
        this.account = JSON.parse(accountData);
      } else {
        console.error('No account data found in localStorage.');
      }
    }

    onSubmit() {
        if (this.updateForm.valid) {
          const accountData = this.updateForm.value;
          const birthday = accountData.birthday; // Ngày sinh đầu vào ở định dạng 'YYYY-MM-DD'
          const formattedBirthday = moment(birthday, 'YYYY-MM-DD').format('DD/MM/YYYY HH:mm:ss');
          console.log("account id: " + this.account.id);
           this.accountService.findAccountById(this.account.id).then(
                (res) => {
                    var accountFindById = res as Account;
                    var accountLogin: AccountLogin = {
                        email: accountFindById.email,
                        password: this.updateForm.value.currentPassword,
                    }
                    if(this.updateForm.value.newPassword || this.updateForm.value.confirmPassword) {
                      if(this.updateForm.value.newPassword === this.updateForm.value.confirmPassword) {
                          this.accountService.login(accountLogin).then(
                              (res) => {
                                  var statusCheckPass = res.status;
                                  if(statusCheckPass) {
                                      var updateAccount: Account = {
                                          id: this.account.id,
                                          username: accountData.username,
                                          password: accountData.newPassword,
                                          birthday: formattedBirthday,
                                          gender: accountData.gender,
                                          email: accountData.email,
                                          phone: accountData.phone,
                                          securitycode: accountFindById.securitycode,
                                          verify: accountFindById.verify
                                      }
                                      this.accountService.update(updateAccount).then(
                                          (res) => {
                                              var statusUpdate = res.status;
                                              if(statusUpdate) {
                                                  this.messageService.add({
                                                      severity: 'success',
                                                      summary: 'Cập nhật thành công',
                                                      detail: 'Bạn đã cập nhật tài khoản thành công.'
                                                  });
                                                  localStorage.removeItem('account'); 
                                                  localStorage.setItem('account', JSON.stringify(updateAccount));
                                                  console.log(localStorage.getItem("account"));
                                                  this.router.navigate(['/home']);
                                              }
                                          },
                                          (err) => {
                                              console.log("Update nếu đổi pass: " + err);
                                          }
                                      )
                                  } else {
                                      this.messageService.add({
                                          severity: 'error',
                                          summary: 'Cập nhật thất bại',
                                          detail: 'Mật khẩu hiện tại không đúng. Vui lòng thử lại.'
                                      });
                                  }
                              },
                              (err) => {
                                  console.log("Check current password: " + err);
                              }
                          )
                      } else {
                          this.messageService.add({
                              severity: 'error',
                              summary: 'Cập nhật thất bại',
                              detail: 'Mật khẩu mới và mật khẩu xác nhận không khớp. Vui lòng thử lại.'
                          });
                      }
                  } else {
                      var updateAccount: Account = {
                          id: this.account.id,
                          username: accountData.username,
                          password: this.account.password,  
                          birthday: formattedBirthday,
                          gender: accountData.gender,
                          email: accountData.email,
                          phone: accountData.phone,
                          securitycode: accountFindById.securitycode,
                          verify: accountFindById.verify
                      }
                      this.accountService.update(updateAccount).then(
                          (res) => {
                              var statusUpdate = res.status;
                              if(statusUpdate) {
                                  this.messageService.add({
                                      severity: 'success',
                                      summary: 'Cập nhật thành công',
                                      detail: 'Bạn đã cập nhật tài khoản thành công.'
                                  });
                                  localStorage.removeItem('account'); 
                                  localStorage.setItem('account', JSON.stringify(updateAccount));
                                  console.log(localStorage.getItem("account"));
                                  this.router.navigate(['/home']);
                              }
                          },
                          (err) => {
                              console.log("Update không đổi pass: " + err);
                          }
                      )
                  }
                  
                },
                (err) => {
                    console.log("find by id: " + err);
                }
           )
        }
      }

      togglePasswordVisibility(field: string) {
        if (field === 'currentPassword') {
          this.showCurrentPassword = !this.showCurrentPassword;
        } else if (field === 'newPassword') {
          this.showNewPassword = !this.showNewPassword;
        } else if (field === 'confirmPassword') {
          this.showConfirmPassword = !this.showConfirmPassword;
        }
      }
    
      private matchPassword(passwordField: string, confirmPasswordField: string) {
        return (formGroup: FormGroup) => {
          const password = formGroup.get(passwordField)?.value;
          const confirmPassword = formGroup.get(confirmPasswordField)?.value;
          
          if (password !== confirmPassword) {
            formGroup.get(confirmPasswordField)?.setErrors({ mismatch: true });
          } else {
            formGroup.get(confirmPasswordField)?.setErrors(null);
          }
        };
      }
}