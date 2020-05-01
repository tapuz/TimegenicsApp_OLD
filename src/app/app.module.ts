import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PictureproofPage } from '../pages/pictureproof/pictureproof';
import { DocscanPage } from '../pages/docscan/docscan';

import { WordpressService } from '../services/wordpress.service';
import { AuthenticationService } from '../services/authentication.service';

import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { NativeStorage } from '@ionic-native/native-storage'; 


@NgModule({
  declarations: [
    MyApp,
    HomePage
    //LoginPage,
    //PictureproofPage
    //DocscanPage

  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    PictureproofPage,
    DocscanPage
  ],
  providers: [
    StatusBar,
    SplashScreen, 
    Camera, 
    FileTransfer, 
    NativeStorage,
    WordpressService,
    AuthenticationService,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
