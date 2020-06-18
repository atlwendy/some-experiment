import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TsLoginFormModule } from '@terminus/ui/login-form';
import { TsCardModule } from '@terminus/ui/card';
import { LoginComponent } from './login.component';
import { TsSpacingModule } from '@terminus/ui/spacing';
import { CommonModule } from '@angular/common';

export * from './login.component';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    TsCardModule,
    TsLoginFormModule,
    TsSpacingModule,
  ],
  exports:[ LoginComponent ],
  providers: [ ],
})
export class LoginModule { }
