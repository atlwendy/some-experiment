import { Component, Input, NgZone } from '@angular/core';
import { merge, of } from 'rxjs';
import { startWith, switchMap, catchError, map } from 'rxjs/operators';
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

  public visualization='xy';
  public georgiaResult;
  public aChart;

  public getGeorgiaResult = () => {
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.dataService.getRawData('georgia');
        }),
        map((d) => this.formatData(d)),
        catchError((e) => {
          console.log('error: ', e);
          return of();
        })
      ).subscribe((data: Array<GADisplayData>) => {
        this.georgiaResult = data;
        console.log('this.georgiaResult inside rxjs: ', this.georgiaResult);
      })
  }

  constructor(
    private dataService: RetrieveDataService,
    private zone: NgZone,
  ) { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv", am4charts.XYChart);
      this.aChart = chart;
    });
  }

  public formatData(data): Array<object> {
    const result = []
    data.map((d) => {
      let formatted = {};
      formatted['date'] = new Date(this.dateFormat(d['date'].toString()));
      // formatted['totalConfirmed'] = d['positive'];
      // formatted['totalHospitalized'] = d['hospitalizedCumulative'];
      // formatted['fatality'] = d['death'];
      // formatted['totalTested'] = d['totalTestResults'];
      // formatted['deathIncrease'] = d['deathIncrease'];
      formatted['value'] = d['positiveIncrease'];
      // formatted['hospitalizedIncrease'] = d['hospitalizedIncrease'];
      result.push(formatted);
    })
    return result;
  }

  public dateFormat(d) {
    return d.slice(0,4) + '-' + d.slice(4,6) + '-' + d.slice(6,8);
  }

  public getGeorgiaChart(chart: TsChart) {
    this.getGeorgiaResult();
    if (tsChartXYTypeCheck(chart)) {
      // this.chartTab = true;
      chart.data = [
        {
          "date": "2020-05-18T00:00:00.000Z",
          "value": 380
        },
        {
          "date": "2020-05-17T00:00:00.000Z",
          "value": 554
        },
        {
          "date": "2020-05-16T00:00:00.000Z",
          "value": 466
        },
        {
          "date": "2020-05-15T00:00:00.000Z",
          "value": 823
        },
        {
          "date": "2020-05-14T00:00:00.000Z",
          "value": 526
        },
        {
          "date": "2020-05-13T00:00:00.000Z",
          "value": 697
        },
        {
          "date": "2020-05-12T00:00:00.000Z",
          "value": 708
        },
        {
          "date": "2020-05-11T00:00:00.000Z",
          "value": 486
        },
        {
          "date": "2020-05-10T00:00:00.000Z",
          "value": 909
        },
        {
          "date": "2020-05-09T00:00:00.000Z",
          "value": 426
        },
        {
          "date": "2020-05-08T00:00:00.000Z",
          "value": 667
        },
        {
          "date": "2020-05-07T00:00:00.000Z",
          "value": 743
        },
        {
          "date": "2020-05-06T00:00:00.000Z",
          "value": 985
        },
        {
          "date": "2020-05-05T00:00:00.000Z",
          "value": 343
        },
        {
          "date": "2020-05-04T00:00:00.000Z",
          "value": 766
        },
        {
          "date": "2020-05-03T00:00:00.000Z",
          "value": 296
        },
        {
          "date": "2020-05-02T00:00:00.000Z",
          "value": 1036
        },
        {
          "date": "2020-05-01T00:00:00.000Z",
          "value": 1115
        },
        {
          "date": "2020-04-30T00:00:00.000Z",
          "value": 583
        },
        {
          "date": "2020-04-29T00:00:00.000Z",
          "value": 957
        },
        {
          "date": "2020-04-28T00:00:00.000Z",
          "value": 702
        },
        {
          "date": "2020-04-27T00:00:00.000Z",
          "value": 512
        },
        {
          "date": "2020-04-26T00:00:00.000Z",
          "value": 706
        },
        {
          "date": "2020-04-25T00:00:00.000Z",
          "value": 548
        },
        {
          "date": "2020-04-24T00:00:00.000Z",
          "value": 635
        },
        {
          "date": "2020-04-23T00:00:00.000Z",
          "value": 772
        },
        {
          "date": "2020-04-22T00:00:00.000Z",
          "value": 859
        },
        {
          "date": "2020-04-21T00:00:00.000Z",
          "value": 934
        },
        {
          "date": "2020-04-20T00:00:00.000Z",
          "value": 646
        },
        {
          "date": "2020-04-19T00:00:00.000Z",
          "value": 632
        },
        {
          "date": "2020-04-18T00:00:00.000Z",
          "value": 475
        },
        {
          "date": "2020-04-17T00:00:00.000Z",
          "value": 1525
        },
        {
          "date": "2020-04-16T00:00:00.000Z",
          "value": 682
        },
        {
          "date": "2020-04-15T00:00:00.000Z",
          "value": 764
        },
        {
          "date": "2020-04-14T00:00:00.000Z",
          "value": 908
        },
        {
          "date": "2020-04-13T00:00:00.000Z",
          "value": 863
        },
        {
          "date": "2020-04-12T00:00:00.000Z",
          "value": 293
        },
        {
          "date": "2020-04-11T00:00:00.000Z",
          "value": 676
        },
        {
          "date": "2020-04-10T00:00:00.000Z",
          "value": 917
        },
        {
          "date": "2020-04-09T00:00:00.000Z",
          "value": 665
        },
        {
          "date": "2020-04-08T00:00:00.000Z",
          "value": 1083
        },
        {
          "date": "2020-04-07T00:00:00.000Z",
          "value": 1504
        },
        {
          "date": "2020-04-06T00:00:00.000Z",
          "value": 667
        },
        {
          "date": "2020-04-05T00:00:00.000Z",
          "value": 487
        },
        {
          "date": "2020-04-04T00:00:00.000Z",
          "value": 329
        },
        {
          "date": "2020-04-03T00:00:00.000Z",
          "value": 483
        },
        {
          "date": "2020-04-02T00:00:00.000Z",
          "value": 710
        },
        {
          "date": "2020-04-01T00:00:00.000Z",
          "value": 709
        },
        {
          "date": "2020-03-31T00:00:00.000Z",
          "value": 1120
        },
        {
          "date": "2020-03-30T00:00:00.000Z",
          "value": 158
        },
        {
          "date": "2020-03-29T00:00:00.000Z",
          "value": 285
        },
        {
          "date": "2020-03-28T00:00:00.000Z",
          "value": 365
        },
        {
          "date": "2020-03-27T00:00:00.000Z",
          "value": 476
        },
        {
          "date": "2020-03-26T00:00:00.000Z",
          "value": 278
        },
        {
          "date": "2020-03-25T00:00:00.000Z",
          "value": 221
        },
        {
          "date": "2020-03-24T00:00:00.000Z",
          "value": 254
        },
        {
          "date": "2020-03-23T00:00:00.000Z",
          "value": 172
        },
        {
          "date": "2020-03-22T00:00:00.000Z",
          "value": 93
        },
        {
          "date": "2020-03-21T00:00:00.000Z",
          "value": 87
        },
        {
          "date": "2020-03-20T00:00:00.000Z",
          "value": 133
        },
        {
          "date": "2020-03-19T00:00:00.000Z",
          "value": 90
        },
        {
          "date": "2020-03-18T00:00:00.000Z",
          "value": 51
        },
        {
          "date": "2020-03-17T00:00:00.000Z",
          "value": 25
        },
        {
          "date": "2020-03-16T00:00:00.000Z",
          "value": 22
        },
        {
          "date": "2020-03-15T00:00:00.000Z",
          "value": 33
        },
        {
          "date": "2020-03-14T00:00:00.000Z",
          "value": 24
        },
        {
          "date": "2020-03-13T00:00:00.000Z",
          "value": 11
        },
        {
          "date": "2020-03-12T00:00:00.000Z",
          "value": 9
        },
        {
          "date": "2020-03-11T00:00:00.000Z",
          "value": 5
        },
        {
          "date": "2020-03-10T00:00:00.000Z",
          "value": 5
        },
        {
          "date": "2020-03-09T00:00:00.000Z",
          "value": 5
        },
        {
          "date": "2020-03-08T00:00:00.000Z",
          "value": 1
        },
        {
          "date": "2020-03-07T00:00:00.000Z",
          "value": 4
        },
        {
          "date": "2020-03-06T00:00:00.000Z",
          "value": 0
        },
        {
          "date": "2020-03-05T00:00:00.000Z",
          "value": 0
        },
        {
          "date": "2020-03-04T00:00:00.000Z",
          "value": null
        }
      ]
      // chart.data = this.georgiaResult;
      console.log('this.georgiaResult: ', this.georgiaResult);
      // chart.data = [{date: '02/01/2020', value: 100}, {date: '02/02/2020', value: 200}]
      console.log('chart: ', chart);

      const dateAxis = chart.xAxes.push(new am4charts.DateAxis() as any);
      dateAxis.renderer.grid.template.location = 0;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis() as any);
      if (valueAxis.tooltip) {
        valueAxis.tooltip.disabled = true;
      }
      valueAxis.renderer.minWidth = 35;

      const series = (chart.series as any).push(new am4charts.LineSeries() as any);
      series.dataFields.dateX = 'date';
      series.dataFields.valueY = 'value';

      series.tooltipText = '{valueY.value}';
      chart.cursor = new am4charts.XYCursor() as any;

      // const scrollbarX = new am4charts.XYChartScrollbar();
      // scrollbarX.series.push(series);
      this.aChart = chart;
    }
  }
}