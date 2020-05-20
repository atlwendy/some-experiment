import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { GraphComponent } from './graph.component';
import { TsChartModule } from '@terminus/ui/chart';

export * from './graph.component';

@NgModule({
  declarations: [
    GraphComponent,
  ],
  imports: [
    BrowserModule,
    TsChartModule,
  ],
  exports:[ GraphComponent ],
  providers: [ ],
})
export class GraphModule { }
