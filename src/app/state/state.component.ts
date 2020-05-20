import { Component, Input, NgZone } from '@angular/core';
import { GADisplayData } from '../app.component';
import { RetrieveDataService } from 'src/services/retrieve-data';
import { merge, of } from 'rxjs';
import { startWith, switchMap, catchError, map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { TsChart } from '@terminus/ui/chart/';


@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent {
  public chartTab;
  public georgiaResult;
  public countryResult;
  public georgiaDataSource = new MatTableDataSource<GADisplayData>([]);
  public georgiaTableTitle = 'Georgia State Data';
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

  constructor(
    private dataService: RetrieveDataService,
  ) { }

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
  

}