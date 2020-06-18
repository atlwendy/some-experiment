import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '../../services';

import {
  TsLoginFormResponse,
  TsLoginFormComponent,
} from '@terminus/ui/login-form';

@Component({templateUrl: './login.component.html'})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  public progress = false;
  public link = '/reset';

  @ViewChild(TsLoginFormComponent, { static: true })
  loginFormComponent!: TsLoginFormComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) {}

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    const url = this.route.snapshot.queryParams['returnUrl'];
    if (!url || url === '/') {
      this.returnUrl = '/main';
    } else {
      this.returnUrl = url;
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/main';
    console.log('this.returnUrl: ', this.returnUrl);
  }


  formSubmission(e: TsLoginFormResponse): void {
    console.warn('DEMO: Form value: ', e);
    this.progress = true;
    this.submitted = true;

    this.loading = true;
    this.authenticationService.login(e.email, e.password)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/main']);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
      });
  }

  resetForm() {
    console.log('DEMO: Reset form');
    this.loginFormComponent.resetForm();
  }

  logForm(): void {
    console.log('DEMO: Current form state: ', this.loginFormComponent.loginForm);
  }
}