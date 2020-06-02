import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { StateComponent } from './state.component';
import { MatTableModule } from '@angular/material/table';
import { TsButtonModule } from '@terminus/ui/button';
import { TsChartModule } from '@terminus/ui/chart';
import { TsSelectionListModule } from '@terminus/ui/selection-list';
import { GraphModule } from '../graph/graph.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TsOptionModule } from '@terminus/ui/option';
import { TsTabsModule } from '@terminus/ui/tabs';

export * from './state.component';

@NgModule({
  declarations: [
    StateComponent,
  ],
  imports: [
    BrowserModule,
    MatTableModule,
    ReactiveFormsModule,
    GraphModule,
    TsButtonModule,
    TsChartModule,
    TsOptionModule,
    TsTabsModule,
    TsSelectionListModule,
  ],
  exports:[ StateComponent ],
  providers: [ ],
})
export class StateModule { }
