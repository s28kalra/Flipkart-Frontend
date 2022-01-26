import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddProduct } from '../dto/add-product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl=environment.baseUrl;

  constructor(private http: HttpClient) { }

  // Get Product Detail View With All its Images
  getProductWithId(productId: number): Observable<any> {
    return this.http.get(this.baseUrl.concat("product/" + productId));
  }

  // Pagination Functions // making size default to as 20 by Spring

  getProductListPaginate(thePage: number, size: number, sort: string): Observable<any> {
    return this.http.get(`${this.baseUrl}products?page=${thePage}&size=${size}&sort=${sort}`);
  }

  getProductListPaginateForCategory(categoryId: number, thePage: number, size: number, sort: string)
    : Observable<any> {
    return this.http.get(`${this.baseUrl}category/${categoryId}?page=${thePage}&size=${size}&sort=${sort}`);
  }

  getProductListPaginateForSearch(keyword: string, thePage: number, size: number, sort: string) {
    return this.http.get(`${this.baseUrl}search/${keyword}?page=${thePage}&size=${size}&sort=${sort}`);
  }

  addProduct(formData: FormData):Observable<any>{
    return this.http.post(this.baseUrl+"addProduct", formData);
  }

}
