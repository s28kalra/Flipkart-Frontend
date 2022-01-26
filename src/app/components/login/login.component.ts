import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from "@okta/okta-angular";
import * as OktaSignIn from '@okta/okta-signin-widget';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';

import myAppConfig from 'src/app/config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin!: any;

  constructor(private oktaAuthService: OktaAuthService, private spiner: NgxSpinnerService) {
    spiner.show();
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/flipkart-logo.jpg',
      features: {
        registration: true
      },
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    }
    );
    spiner.hide();
  }

  ngOnInit(): void {
    this.oktaSignin.remove();
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget' // this name should be same as div tag id  in login component html
    },
      (res: any) => {
        if (res.status === 'SUCCESS'){
          this.oktaAuthService.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );

  }

}
