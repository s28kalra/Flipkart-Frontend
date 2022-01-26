import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { from, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  baseUrl=environment.baseUrl;
  
  constructor(private oktaAuthService: OktaAuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

    const securedEndPoints= ["transaction", "address", "addProduct"];

    if(securedEndPoints.some(url => request.urlWithParams.includes(url))){
      const accessToken= this.oktaAuthService.getAccessToken();
      request= request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + accessToken
          }
      });

    }
    
    return await lastValueFrom(next.handle(request));

  }

  
}
