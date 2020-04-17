import { Component, ViewChild, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { RetrieveDataService } from 'src/services/retrieve-data';
import { merge, of } from 'rxjs';
import { switchMap, map, startWith, catchError } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerComponent } from './spinner/spinner.component';

export interface DisplayData {
  Country: string;
  Cases: string;
  Deaths: string;
  FatalityRate: Number;
  Population: Number;
  AffectedRate: Number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit {

  public title = 'covid-graph';
  public message = 'Loading...';
  public cData;
  public result;
  public population;
  public dataSource = new MatTableDataSource<DisplayData>([]);
  displayedDataColumns: string[] = ['Rank', 'Country', 'Cases', 'Deaths', 'FatalityRate', 'Population', 'AffectedRate'];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private dataService: RetrieveDataService
  ) { }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // setTimeout(() => {
    //   this.getResult();
    // }, 2000);
  }

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

}
