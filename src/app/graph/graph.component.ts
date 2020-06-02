import { Component, Input, NgZone } from '@angular/core';
import { merge, of, BehaviorSubject } from 'rxjs';
import { startWith, switchMap, catchError, map, take } from 'rxjs/operators';
import { GADisplayData } from '../app.component';
import { RetrieveDataService } from 'src/services/retrieve-data';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { TsChart, tsChartXYTypeCheck } from '@terminus/ui/chart';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent {

  public visualization = 'xy';
  private chart!: am4charts.XYChart;
  private stateData;

  @Input()
  public set state(r: string) {
    if (!r) {
      return;
    }
    this._state = r;
    this.initializeChartData();
    console.log('this._state: ', this._state, '; this.chart: ', this.chart);
  }
  public get state(): string {
    return this._state;
  }
  private _state: string;

  @Input()
  public stateStream;

  public chartCreated(chart: TsChart) {
    console.log('chart created');
    this.getStateResult(chart, this.state);
  }

  public getStateResult = (chart, state) => {
    console.log('chart: ', chart);
    this.chart = chart;
    if (state) {
      merge()
        .pipe(
          startWith({}),
          switchMap(() => {
            return this.dataService.getRawData(state);
          }),
          map((d) => this.formatData(d)),
          catchError((e) => {
            console.log('error: ', e);
            return of();
          })
        ).subscribe((data: Array<GADisplayData>) => {
          chart.data = data;
          this.stateData = data;
          console.log('get data, draw chart');
          this.getStateChart(chart);
        })
    }
  }

  public getStateArrays = (state, chart) => {
    if (state) {
      merge()
        .pipe(
          startWith({}),
          switchMap(() => {
            return this.dataService.getRawData(this.state);
          }),
          map((d) => this.formatData(d)),
          catchError((e) => {
            console.log('error: ', e);
            return of();
          })
        ).subscribe((data: Array<GADisplayData>) => {
          chart.data = data;
          this.getStateChart(chart);
        })
    }
  }

  constructor(
    private dataService: RetrieveDataService,
    private zone: NgZone,
  ) { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4charts.XYChart);
    });
  }

  public formatData(data): Array<object> {
    const result = []
    data.map((d) => {
      let formatted = {};
      formatted['date'] = new Date(this.dateFormat(d['date'].toString()));
      formatted['totalConfirmed'] = d['positive'];
      formatted['totalHospitalized'] = d['hospitalizedCumulative'];
      formatted['fatality'] = d['death'];
      formatted['totalTested'] = d['totalTestResults'];
      formatted['deathIncrease'] = d['deathIncrease'];
      formatted['positiveIncrease'] = d['positiveIncrease'];
      formatted['hospitalizedIncrease'] = d['hospitalizedIncrease'];
      result.push(formatted);
    })
    return result;
  }

  public dateFormat(d) {
    return d.slice(0,4) + '-' + d.slice(4,6) + '-' + d.slice(6,8);
  }

  public getStateChart(chart: TsChart) {
    if (tsChartXYTypeCheck(chart)) {
      this.chart = chart as any;
      const dateAxis = chart.xAxes.push(new am4charts.DateAxis() as any);
      dateAxis.renderer.grid.template.location = 0;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis() as any);
      if (valueAxis.tooltip) {
        valueAxis.tooltip.disabled = true;
      }
      valueAxis.renderer.minWidth = 35;

      const series = (chart.series as any).push(new am4charts.ConeSeries() as any);
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = 'positiveIncrease';
      series.columns.template.fillOpacity = 0.5;
      series.columns.template.strokeOpacity = 0;
      series.name = 'Confirmed Case Increase'

      series.tooltipText = 'Confirmed Case Increase {valueY.value}';
      chart.cursor = new am4charts.XYCursor() as any;

      // const scrollbarX = new am4charts.XYChartScrollbar();
      // scrollbarX.series.push(series);
      // chart.scrollbarX = scrollbarX as any;

      //create line
      var lineSeries = (chart.series as any).push(new am4charts.LineSeries() as any);
      lineSeries.dataFields.dateX = "date";
      lineSeries.dataFields.valueY = "hospitalizedIncrease";
      lineSeries.name = "Hospitalized Increase";
      lineSeries.strokeWidth = 3;
      lineSeries.tooltipText = "Hospitalized Increase {valueY.value}";

      //add bullets
      var circleBullet = lineSeries.bullets.push(new am4charts.CircleBullet());
      circleBullet.circle.fill = am4core.color("#fff");
      circleBullet.circle.strokeWidth = 2;

      //add chart cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.behavior = "zoomY";

      //add legend
      chart.legend = new am4charts.Legend();

      this.initializeChartData();
    }
  }

  private initializeChartData(): void {
    if (!this.chart || !this.state) {
      return;
    }
    // AmCharts seems to hold onto the LabelBullets when data is refreshed, the only
    // way i've found to get around this is to clear the series data and reinit it.
    // We also want to reset the colors so they don't constantly change.
    this.chart.colors.reset();
    if (this.chart.series.length) {
      for (const s of this.chart.series) {
        s.bulletsContainer.disposeChildren();
      }
    }

  }
}