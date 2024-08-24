import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from './../../services/account.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
})
export class VerifyAccountComponent implements OnInit {
  email: string = '';
  status: 'initial' | 'loading' | 'success' | 'error' = 'initial';

  constructor(private accountService: AccountService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  verifyAccount(): void {
    this.status = 'loading';
    console.log("verify: " + this.email);
    this.accountService.verifyAccount(this.email).then(
      (response) => {
        setTimeout(() => this.router.navigate(['/home']), 1000);
      },
      (error) => {
        this.status = 'error';
      }
    );
  }
}
