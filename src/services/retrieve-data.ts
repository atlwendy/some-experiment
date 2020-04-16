import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class RetrieveDataService {
    public defaultHeaders;

    constructor(private http: HttpClient) {
        this.defaultHeaders = new HttpHeaders();
    }

    getCountryData(): Observable<any> {
        const href = 'https://covid19-server.chrismichael.now.sh/api/v1/CountriesWhereCoronavirusHasSpread';
        const data = this.http.get(href);
        console.log('data: ', data);
        return data
    }

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
}

const COUNTRIES = [
    'China',
    'India',
    'United States of America',
//     'Russia',
//     'Mexico',
//     'Japan',
//     'Germany',
//     'France',
//     'Thailan',
//     'United Kingdom',
//     'Italy',
//     'South Africa',
//     'South Korea',
//     'Colombia',
//     'Spain',
//     'Argentina',
//     'Algeria',
//     'Ukraine',
//     'Iraq',
//     'Poland',
//     'Canada',
//     'Saudi Arabia',
//     'Malaysia',
//     'Australia',
//     'Taiwan',
//     'Niger',
//     'Netherlands',
//     'Switzerland',
]