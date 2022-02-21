import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as pData from '../data/worldpopulation.json';


@Injectable()
export class RetrieveDataService {
    public defaultHeaders;

    constructor(private http: HttpClient) {
        this.defaultHeaders = new HttpHeaders();
    }

    getRawData(type: string): Observable<any> {
        let href: string;
        switch (type) {
          case 'country':
            //href = 'https://covid19-server.chrismichael.now.sh/api/v1/CountriesWhereCoronavirusHasSpread';
            href = 'https://www.ncovid19.it/api/v1/AllReports.php'
            break;
          case 'georgia':
            const proxyurl = "https://cors-anywhere.herokuapp.com/";
            href = proxyurl + 'https://covidtracking.com/api/v1/states/ga/daily.json';
            break;
        }
        return this.http.get(href);
    }

    /* Retrieve population data from API end point */

    getCountryPopulation(countries): Object[] {
        const href = 'https://restcountries.eu/rest/v2/name/';
        let countryPopulation: Object[] = [{name: '', population: ''}];
        countries = countries ? countries : COUNTRIES
        countries.forEach((name) => {
            const endPoint = href + name;
            const returnData = this.http.get(endPoint);
            returnData.subscribe((result: Object[]) => {
                const r = result[0];
                const point = Math.max.apply(Math, result.map(function(o) { return o['population']; }))
                countryPopulation.push({"name": name, "population": point});
            })
        })
        return countryPopulation;
    }

    getAllCountryData() {
        return this.http.get('https://restcountries.eu/rest/v2/all/');
    }

    /* Retrieve population data from local json */

    getCountryPopulationLocal() {
      const d = (pData as any).default;
      return of(d);
    }
}

const COUNTRIES = [
    'China',
    'India',
    'United States of America',
    'Russia',
    'Mexico',
    'Japan',
    'Germany',
    'France',
    'Thailan',
    'United Kingdom',
    'Italy',
    'South Africa',
    'South Korea',
    'Colombia',
    'Spain',
    'Argentina',
    'Algeria',
    'Ukraine',
    'Iraq',
    'Poland',
    'Canada',
    'Saudi Arabia',
    'Malaysia',
    'Australia',
    'Taiwan',
    'Niger',
    'Netherlands',
    'Switzerland',
]
