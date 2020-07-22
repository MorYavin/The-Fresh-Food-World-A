import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(credentials:object): Observable<any>{
    return this.http.post<any>(`${environment.server}/api/auth/login`, credentials)
  }
  
  public isLoggedIn(): Observable<any> {
    return this.http.get<any>(`${environment.server}/api/auth/isLoggedIn`, { headers: { "Authorization": "Bearer " + localStorage.getItem('token') } })
  }

  public checkFirstForm(credentials:object): Observable<any>{
    return this.http.post<any>(`${environment.server}/api/auth/validate`, credentials)
  }
  public addUser(newUser): Observable<any> {
    return this.http.post<any>(`${environment.server}/api/auth/register`, newUser)
  }

}
