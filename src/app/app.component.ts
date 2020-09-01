import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
//import { StatusBar } from '@ionic-native/status-bar';
//import { SplashScreen } from '@ionic-native/splash-screen';
//import { Plugins, StatusBarStyle } from '@capacitor/core';


import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthenticationService } from '../services/authentication.service';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;//= HomePage;
  

  constructor(
    platform: Platform, 
    //statusBar: StatusBar, 
    //splashScreen: SplashScreen,
    
    authenticationService: AuthenticationService
    ) {
    //const { SplashScreen, StatusBar } = Plugins;
    platform.ready().then(() => {
      authenticationService.getUser()
      .then(
        data => {
          console.log('hier is the date : ' + data.token);
          authenticationService.validateAuthToken(data.token)
          .subscribe(
            res => {
              console.log(res.json().data.status);
              this.rootPage = HomePage
              
            },
            err =>  {
             console.log('auth resp:' + err.json()); 
             this.rootPage = LoginPage
            }
          )
        },
        err => this.rootPage = LoginPage
      );
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.setStyle({ style: StatusBarStyle.Light });
      //SplashScreen.hide();
    });
  }
}
