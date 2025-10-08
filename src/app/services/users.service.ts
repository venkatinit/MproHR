import { Injectable } from '@angular/core';
import { User } from "../models/user";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable, of, BehaviorSubject, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  api_url = environment.API_URL;  
  public current_user: User | undefined;
  constructor(private httpClient:HttpClient) { 
  }


  
  AddUser(user:User):Observable<any>{
    return this.httpClient.post(`${this.api_url}/user/`,user);
  }
 
}

