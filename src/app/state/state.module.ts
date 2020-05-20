import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StateComponent } from './state.component';
import { MatTableModule } from '@angular/material/table';
import { TsButtonModule } from '@terminus/ui/button';
import { TsChartModule } from '@terminus/ui/chart';
import { GraphModule } from '../graph/graph.module';

export * from './state.component';

@NgModule({
  declarations: [
    StateComponent,
  ],
  imports: [
    BrowserModule,
    MatTableModule,
    GraphModule,
    TsButtonModule,
    TsChartModule,
  ],
  exports:[ StateComponent ],
  providers: [ ],
})
export class StateModule { }
