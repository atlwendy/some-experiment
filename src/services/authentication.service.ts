import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { of } from 'rxjs';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    // return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
    //   .pipe(map(user => {
    //     // login successful if there's a jwt token in the response
    //     if (user && user.token) {
    //       // store user details and jwt token in local storage to keep user logged in between page refreshes
    //       localStorage.setItem('currentUser', JSON.stringify(user));
    //     }

    //     return user;
    //   }));
    let user;
    if (username === 'sg@sportgamerz.com' && password === 'loveit') {
      user = {token: 'feaieoabrabfabrrap'};
      localStorage.setItem('currentUser', JSON.stringify(user));
      console.log('user: ', user);
    } else {
      user = '';
    }

    return of(user);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}