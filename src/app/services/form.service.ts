import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  baseUrl=environment.baseUrl;

  constructor(private http: HttpClient) { }

  getCountries():Observable<any>{
    return this.http.get(this.baseUrl+"countries");
  }

  getStates(countryId: number): Observable<any>{
    return this.http.get(this.baseUrl+"country/"+countryId);
  }

  getDetailsFromZipcode(zipcode: string): Observable<any>{
    let zipcodeUrl=`https://api.postalpincode.in/pincode/${zipcode}`;
    return this.http.get(zipcodeUrl);
  }

    
}
