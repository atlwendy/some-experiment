import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
// eslint-disable-next-line camelcase
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
// eslint-disable-next-line no-duplicate-imports, camelcase
import am4themes_material from '@amcharts/amcharts4/themes/animated';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TsButtonModule } from '@terminus/ui/button';
import {
  TS_AMCHARTS_TOKEN,
  TsAmChartsToken,
  TsChartModule,
} from '@terminus/ui/chart';
import { TsPipesModule } from '@terminus/ui/pipes';
import { TsTabsModule } from '@terminus/ui/tabs';
import { RetrieveDataService } from 'src/services/retrieve-data';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { SpinnerModule } from './spinner/spinner.module';
import { GraphModule } from './graph/graph.module';
import { TsLoginFormModule } from '@terminus/ui/login-form';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AlertService, AuthenticationService, UserService } from 'src/services';
import { JwtInterceptor, ErrorInterceptor } from './helpers';
import { ReactiveFormsModule } from '@angular/forms';
import { MainModule } from './main/main.module';
import { AuthGuard } from './guards/auth.guard';
import { MainComponent } from './main/main.component';
import { RegisterModule } from './register/register.module';
import { TsCardModule } from '@terminus/ui/card';
import { CommonModule } from '@angular/common';
import { LoginModule } from './login/login.module';

export const amChartsFactory = (): TsAmChartsToken => ({
  core: am4core,
  charts: am4charts,
  maps: am4maps,
  // eslint-disable-next-line camelcase
  themes: [am4themes_animated, am4themes_material],
});

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    RegisterModule,
    SpinnerModule,
    LoginModule,
    TsButtonModule,
    TsCardModule,
    TsChartModule,
    TsLoginFormModule,
    TsPipesModule,
    TsTabsModule,
    MainModule,
  ],
  providers: [
    AuthGuard,
    RetrieveDataService,
    AlertService,
    AuthenticationService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: TS_AMCHARTS_TOKEN,
      useFactory: amChartsFactory,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
