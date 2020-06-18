import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { TsCardModule } from '@terminus/ui/card';
import { RegisterComponent } from './register.component';
import { TsButtonModule } from '@terminus/ui/button';
import { TsInputModule } from '@terminus/ui/input';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

export * from './register.component';

@NgModule({
  declarations: [
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    TsCardModule,
    TsButtonModule,
    TsInputModule,
    RouterModule,
  ],
  exports:[ RegisterComponent ],
  providers: [ ],
})
export class RegisterModule { }
