import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { AddAddressComponent } from './components/add-address/add-address.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AddressComponent } from './components/address/address.component';
import { CartDetailComponent } from './components/cart-detail/cart-detail.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { TransactionDetailComponent } from './components/transaction-detail/transaction-detail.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';

const routes: Routes = [
  // order is important of the routes So be careful while writing routes
  { path: 'members', component: MembersPageComponent, canActivate: [OktaAuthGuard] },
  { path: 'address', component: AddressComponent, canActivate: [OktaAuthGuard] },
  { path: 'addAddress', component: AddAddressComponent, canActivate: [OktaAuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [OktaAuthGuard] },
  { path: 'transactions', component: TransactionHistoryComponent, canActivate: [OktaAuthGuard] },
  { path: 'transaction/:trackingNumber', component: TransactionDetailComponent, canActivate: [OktaAuthGuard] },
  { path: 'addProduct', component: AddProductComponent, canActivate: [OktaAuthGuard] },
  { path: 'login/callback', component: OktaCallbackComponent },
  { path: 'login', component: LoginComponent },
  { path: 'product/:productId', component: ProductDetailComponent },
  { path: 'search/:keyword', component: ProductListComponent },
  { path: 'category/:categoryId', component: ProductListComponent },
  { path: 'category', component: ProductListComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'cartDetail', component: CartDetailComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
