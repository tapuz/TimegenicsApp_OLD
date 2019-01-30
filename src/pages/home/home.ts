import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { PictureproofPage } from '../pictureproof/pictureproof';
import { DocscanPage } from '../docscan/docscan';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AlertController } from 'ionic-angular';
import * as Config from '../../config';
import io from 'socket.io-client';
import { WordpressService } from '../../services/wordpress.service';

import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //var declaration

  constructor(
    public navCtrl: NavController, 
    )
    {}

  navToPictureProof(): void {
    this.navCtrl.push(PictureproofPage);
  }

  navToDocScan(): void {
    this.navCtrl.push(DocscanPage);
  }
  
  

 

}
