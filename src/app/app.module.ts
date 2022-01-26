import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';
import { ProductMenuComponent } from './components/product-menu/product-menu.component';
import { SearchComponent } from './components/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from "ngx-bootstrap-spinner";
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailComponent } from './components/cart-detail/cart-detail.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';

import myAppConfig from './config/my-app-config';
import { Router } from '@angular/router';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { TransactionDetailComponent } from './components/transaction-detail/transaction-detail.component';
import { AddressComponent } from './components/address/address.component';
import { AddAddressComponent } from './components/add-address/add-address.component';
import { AddProductComponent } from './components/add-product/add-product.component';

const oktaConfig =Object.assign({
  onAuthRequired: (oktaAuth: any, injector: any) =>{
    const route= injector.get(Router);
    route.navigate(['/login']);
  }
}, myAppConfig.oidc);

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductMenuComponent,
    SearchComponent,
    ProductDetailComponent,
    CartStatusComponent,
    CartDetailComponent,
    CheckoutComponent,
    LoginComponent,
    LoginStatusComponent,
    MembersPageComponent,
    TransactionHistoryComponent,
    TransactionDetailComponent,
    AddressComponent,
    AddAddressComponent,
    AddProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule, 
    OktaAuthModule, 
    NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ProductService, {provide: OKTA_CONFIG, useValue: oktaConfig}, 
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
