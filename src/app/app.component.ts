import { Component, ViewChild, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { RetrieveDataService } from 'src/services/retrieve-data';
import { merge, pipe, of } from 'rxjs';
import { switchMap, map, startWith, catchError } from 'rxjs/operators';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import {
  TsChart,
  tsChartChordTypeCheck,
  tsChartMapTypeCheck,
  tsChartPieTypeCheck,
  tsChartRadarTypeCheck,
  tsChartSankeyTypeCheck,
  tsChartTreeTypeCheck,
  TsChartVisualizationOptions,
  tsChartXYTypeCheck,
} from '@terminus/ui/chart';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface DisplayData {
  Country: string;
  Cases: string;
  Deaths: string;
  FatalityRate: Number;
  Population: Number;
  AffectedRate: Number;
}

const XY_DATA: Record<string, any>[] = [];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit {

  public title = 'covid-graph';
  public cData;
  public result;
  public population;
  private chart!: am4charts.XYChart;
  public dataSource = new MatTableDataSource<DisplayData>([]);
  displayedDataColumns: string[] = ['Rank', 'Country', 'Cases', 'Deaths', 'FatalityRate', 'Population', 'AffectedRate'];

  

  // public visualizationOptions: TsChartVisualizationOptions[] = [
  //   'xy',
  //   'pie',
  //   'map',
  //   'radar',
  //   'tree',
  //   'sankey',
  //   'chord',
  // ];
  // visualization: TsChartVisualizationOptions = this.visualizationOptions[0];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private dataService: RetrieveDataService
  ) { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    setTimeout(() => {
      this.dataSource.sort = this.sort;
    }, 20);
  }

  // public getResult() {
  //   this.dataService.getCountryData()
  //     .subscribe((d) => {
  //       this.result = d.table.slice(0,20);
  //       this.result.forEach((r) => {
  //         r['rate'] = (parseFloat(r['Deaths'].replace(/,/g, '')) * 100 / parseFloat(r['Cases'].replace(/,/, ''))).toFixed(1);
  //       })
  //       console.log('this.result: ', this.result);
  //       // this.chartCreated(this.cData);
  //     })
  //   setTimeout(() => {
  //     this.getPopulation();
  //   }, 100)
  // }

  public getResult = () => {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.dataService.getCountryData()
        }),
        switchMap((cases) => {
          return this.dataService.getAllCountryData()
          .pipe(
            map((population: Array<Object>) => {
              cases.table.concat(population);
              let newData = [];
              cases.table.forEach((c) => {
                population.map((p) => {
                  if (c.Country === p['name'] || p['name'].includes(c.Country)) {
                    newData.push({
                      Country: c.Country,
                      Cases: c.Cases,
                      Deaths: c.Deaths,
                      Population: p['population'],
                      FatalityRate: (parseFloat(c['Deaths'].replace(/,/g, '')) * 100 / parseFloat(c['Cases'].replace(/,/, ''))).toFixed(1),
                      AffectedRate: (parseFloat(c['Cases'].replace(/,/g, '')) * 100 / parseFloat(p['population'])).toFixed(4),
                    })
                  }
                })
              })
              
              // newData = Math.max.apply(Math, newData.map(function(o) { return o['Population']; }))
              newData.filter((d, index, self) => {
                index === self.findIndex((t) => {
                  return (t.Country === d.Country && t.Population > d.Population)
                } )
              });
              newData = newData.filter((n) => n.AffectedRate < 10);
              return newData;
            })
          )
        }),
        catchError(() => {
          console.warn('API errors');
          return of([]);
        }),
      ).subscribe((data) => {
        this.result = data;
        this.dataSource.data = data;
      });
      
  }


  public trackByFn(index): number {
    return index;
  }

  // chartCreated(chart: TsChart) {
  //   console.log('chart: ', chart);
  //   this.cData = chart;
  //   this.setChartData(chart, this.visualization);
  // }


  // setChartData(chart: TsChart, type: TsChartVisualizationOptions) {
    
  //   /**
  //    * XY
  //    */
  //   if (tsChartXYTypeCheck(chart)) {
  //     chart.data = this.result;
  //     console.log('chart.data: ', chart.data);

  //     const dateAxis = chart.xAxes.push(new am4charts.DateAxis() as any);
  //     dateAxis.renderer.grid.template.location = 0;

  //     const valueAxis = chart.yAxes.push(new am4charts.ValueAxis() as any);
  //     if (valueAxis.tooltip) {
  //       valueAxis.tooltip.disabled = true;
  //     }
  //     valueAxis.renderer.minWidth = 35;

  //     const series = (chart.series as any).push(new am4charts.LineSeries() as any);
  //     series.dataFields.dateX = 'date';
  //     series.dataFields.valueY = 'value';

  //     series.tooltipText = '{valueY.value}';
  //     chart.cursor = new am4charts.XYCursor() as any;

  //     const scrollbarX = new am4charts.XYChartScrollbar();
  //     scrollbarX.series.push(series);
  //     chart.scrollbarX = scrollbarX as any;
  //     this.createSeries('visitSessionCount', 'View Through Visit Count', 'vertical');
  //     this.createSeries('trackedConversionCount', 'View Through Conversion Count', 'vertical');

  //   }
  // }

  // public createSeries(field: string, name: string, pointerOrientation: am4core.PointerOrientation): any {
  //   // Set up series
  //   const series = this.chart.series.push(new am4charts.ColumnSeries() as any);
  //   series.name = name;
  //   series.dataFields.valueY = field;
  //   series.dataFields.dateX = 'dateUtc';
  //   series.sequencedInterpolation = true;
  //   series.groupFields.valueY = 'sum';

  //   // Configure columns
  //   series.columns.template.align = 'left';
  //   series.columns.template.width = am4core.percent(100);
  //   series.tooltipText = '[bold]{name}[/]\n[font-size:14px]{dateX}: {valueY}';
  //   if (series.tooltip) {
  //     series.tooltip.pointerOrientation = pointerOrientation;
  //   }
  // }


}
