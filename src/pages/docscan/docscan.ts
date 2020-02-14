import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { NativeStorage } from '@ionic-native/native-storage';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AlertController } from 'ionic-angular';
import * as Config from '../../config';

import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';

import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the DocscanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-docscan',
  templateUrl: 'docscan.html',
})
export class DocscanPage {
  base64Image:any;
  myphoto:any;
  pictures=[];
  patientID:any;
  footermsg = "system ready..";
  activePatient: any;
  patientName: string;
  data:Observable<any>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public nativeStorage: NativeStorage,
    
    private camera: Camera, 
    private transfer: FileTransfer, 
    private loadingCtrl:LoadingController,
    private alertCtrl: AlertController,
    public wordpressService: WordpressService,
    public http: Http,
    public authenticationService: AuthenticationService) {

    authenticationService.getUser()
      .then(
        data => {
          this.getActivePatient(data.email);
        });

  }

  getActivePatient(email){
  
        this.data = this.http.get(Config.APM_API_URL + '?task=getActivePatient&userEmail='+email).map(res => res.json());
        this.data.subscribe(data => {
        this.activePatient = data;
        this.patientName = data.patient_surname + ' ' + data.patient_firstname;
        this.patientID = data.patient_id;
        
        
    });
  }

  refreshActivePatient(refresher) {
    this.data.subscribe(data => {
      this.activePatient = data;
        this.patientName = data.patient_surname + ' ' + data.patient_firstname;
        this.patientID = data.patient_id;
        //clear the pictures
        this.pictures = [];
        refresher.complete();
    });
    
  }

  takePhoto(){
    //check if patientID was entered
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum:false,
      targetWidth:1000,
      allowEdit:false,
      correctOrientation:true
    }

    this.camera.getPicture(options).then((imageData) => { 
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      //push picture to array
      this.pictures.push(this.base64Image);
      this.pictures.reverse();
      //upload the photo
      
      this.uploadImage();
      
    }, (err) => {
      // Handle error
    });
  }

  uploadImage(){
    //Show loading
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    // this.footermsg = "Uploading.."
    //loader.present();
    //var patientID = 3;

    //create file transfer object
    const fileTransfer: FileTransferObject = this.transfer.create();

    //random int
    let random = Math.random().toString(36).substring(7);


    //option transfer
    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: this.patientID + "_" + random + ".jpg",
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "image/jpeg",
      headers: {},
      params:{'patientID':this.patientID,'tag':'doc'}
    }


    //file transfer action
    
    fileTransfer.onProgress((progressEvent) => {
		      	//console.log(progressEvent);
				var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
        this.footermsg = "Uploading " + perc + "%";
        console.log(perc);
        //if (perc == 100) {loader.dismiss();}
				//this.progress = perc;
		    });

    fileTransfer.upload(this.base64Image, Config.APM_API_URL + '?task=upload_image', options)
      .then((data) => {
        //alert("Success");
        console.log('done');
        this.footermsg = "Upload done..."
        //loader.dismiss();
        //this.presentAlert('Upload done');
      }, (err) => {
        console.log(err.code);
        //alert("Error");

        //loader.dismiss();
      });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DocscanPage');
  }

}
