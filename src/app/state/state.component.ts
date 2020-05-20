import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { GADisplayData } from '../app.component';
import { RetrieveDataService } from 'src/services/retrieve-data';
import { merge, of, BehaviorSubject, Observable } from 'rxjs';
import { startWith, switchMap, catchError, map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { TsChart } from '@terminus/ui/chart/';
import { FormControl } from '@angular/forms';
import { State, STATES } from './data';
import { TsSelectionListChange } from '@terminus/ui/selection-list';
import { untilComponentDestroyed } from '@terminus/ngx-tools/utilities';


@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit, OnDestroy{
  public chartTab;
  public georgiaResult;
  public countryResult;
  public stateControl = new FormControl('');
  public singleState;
  public georgiaDataSource = new MatTableDataSource<GADisplayData>([]);
  public georgiaTableTitle: Observable<string>;
  displayedGADataColumns: string[] = [
    'date',
    'totalConfirmed',
    'totalHospitalized',
    'fatality',
    'totalTested',
    'deathIncrease',
    'positiveIncrease',
    'hospitalizedIncrease',
    'confirmedRate',
  ];

  // State Data
  public states = STATES.slice();
  // Selection Results
  public simpleMultipleResults: Observable<State[]> | undefined;
  public simpleResults: Observable<State[]> | undefined;
  // Async
  public simpleAsync = false;
  

  constructor(
    private dataService: RetrieveDataService,
  ) { }

  public ngOnInit() {
    this.simpleResults = this.simpleQuery$
      .pipe(
        untilComponentDestroyed(this),
        map(query => this.queryStates(query)),
      );
  }

  public ngOnDestroy(): void {};

  public getGeorgiaResult = (state) => {
    this.chartTab = false;
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.dataService.getRawData(state);
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
      formatted['confirmedRate'] = (parseFloat(d['positive']) * 100 / parseFloat(d['totalTestResults'])).toFixed(2);
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
  public simpleQuery$ = new BehaviorSubject('');

  public queryHasChanged(query: string): void {
    this.simpleQuery$.next(query);
  }

  public formatter(value: State): string {
    return value.name;
  }

  public duplicate(e: TsSelectionListChange): void {
    console.log(`duplicate selection: `, e);
  }

  public selectionChange(e: TsSelectionListChange) {
    this.getGeorgiaResult(e.value[0]['abbreviation']);
    this.georgiaTableTitle.subscribe(e.value[0]['name']);
    console.log(`selection change: `, e);
  }

  public queryStates(query: string): State[] {
    query = query.toLowerCase();

    if (query) {
      const letters = query.split('').map(l => `${l}.*`).join('');
      const regex = new RegExp(letters, 'ig');
      return this.states.filter(s => !!s.name.match(regex));
    }
    // if no query, return first 10 states
    return STATES.slice(0, 54);

  }
  

}