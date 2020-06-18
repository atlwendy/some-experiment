import { Component, ViewChild, OnInit, AfterViewInit, ViewEncapsulation, NgZone } from '@angular/core';
import { RetrieveDataService } from 'src/services/retrieve-data';
import { merge, of } from 'rxjs';
import { switchMap, map, startWith, catchError } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';

import { TsTabCollectionComponent } from '@terminus/ui/tabs';
import { TsChart } from '@terminus/ui/chart';
import { TsTitleCasePipe } from '@terminus/ui/pipes';
import { GraphComponent } from '../graph/graph.module';

export interface DisplayData {
  Country: string;
  Cases: string;
  Deaths: string;
  FatalityRate: Number;
  Population: Number;
  AffectedRate: Number;
}

export interface GADisplayData {
  date: string;
  totalConfirmed: string;
  totalHospitalized: string;
  fatality: string;
  totalTested: string;
  deathIncrease: string;
  hospitalizedIncrease: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MainComponent implements AfterViewInit {

  public title = 'covid-graph';
  public message = 'Loading...';
  public countryTableTitle = 'Country Data Table';
  public georgiaTableTitle = 'Georgia State Data';
  public visualization = 'xy';
  public cData;
  public chartTab = false;
  public countryResult;
  public georgiaResult;
  public population;
  public dataSource = new MatTableDataSource<DisplayData>([]);
  public georgiaDataSource = new MatTableDataSource<GADisplayData>([]);
  public aChart;
  displayedDataColumns: string[] = ['Rank', 'Country', 'Cases', 'Deaths', 'FatalityRate', 'Population', 'AffectedRate'];
  displayedGADataColumns: string[] = [
    'date',
    'totalConfirmed',
    'totalHospitalized',
    'fatality',
    'totalTested',
    'deathIncrease',
    'positiveIncrease',
    'hospitalizedIncrease'
  ]

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('tabCollection', { static: true })
  public tabCollection!: TsTabCollectionComponent;

  @ViewChild('graph')
  public graph!: GraphComponent;

  constructor(
    private dataService: RetrieveDataService,
    private zone: NgZone,
  ) { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.georgiaDataSource.sort = this.sort;
    
    // this.zone.runOutsideAngular(() => {
    //   let chart = am4core.create("chartdiv", am4charts.XYChart);
    //   this.aChart = chart;
    // });
  }

  public getResult = () => {
    this.chartTab = false;
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.dataService.getRawData('country')
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
                      FatalityRate: (parseFloat(c['Deaths'].replace(/,/g, '')) * 100 / parseFloat(c['Cases'].replace(/,/g, ''))).toFixed(1),
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
        this.countryResult = data;
        this.georgiaResult = null;
        this.dataSource.data = data;
      });
      
  }

  public getGeorgiaResult = () => {
    this.chartTab = false;
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.dataService.getRawData('georgia');
        }),
        map((d) => {
          return this.formatData(d);
        }),
        catchError((e) => {
          console.log('error: ', e);
          return of();
        })
      ).subscribe((data: Array<GADisplayData>) => {
        this.georgiaResult = data;
        this.countryResult = null;
        this.georgiaDataSource.data = data;
      })
  }

  public trackByFn(index): number {
    return index;
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

  public getGeorgiaChart(chart: TsChart) {
    this.chartTab = true;
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.aChart) {
        this.aChart.dispose();
      }
    });
  }

}
