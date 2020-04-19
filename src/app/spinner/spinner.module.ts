import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SpinnerComponent } from './spinner.component';

export * from './spinner.component';

@NgModule({
  declarations: [
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
  ],
  exports:[ SpinnerComponent ],
  providers: [ ],
})
export class SpinnerModule { }
