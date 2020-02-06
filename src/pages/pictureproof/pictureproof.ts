import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NativeStorage } from '@ionic-native/native-storage';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AlertController } from 'ionic-angular';
import * as Config from '../../config';
import io from 'socket.io-client';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';

import { Http, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'page-pictureproof',
  templateUrl: 'pictureproof.html'
})
export class PictureproofPage {
  base64Image:any;
  myphoto:any;
  pictures=[];
  patientID:any;
  socket:any;
  APMserver= "http://192.168.0.2:3000";
  footermsg = "system ready..";
  activePatient: any;
  patientName: string;
  data:Observable<any>;
  
  
  

  constructor(
    public nativeStorage: NativeStorage,
    public navCtrl: NavController, 
    private camera: Camera, 
    private transfer: FileTransfer, 
    private loadingCtrl:LoadingController,
    private alertCtrl: AlertController,
    public wordpressService: WordpressService,
    public http: Http,
    public authenticationService: AuthenticationService
    
    )
    {
    console.log("this is the shit: ", this.APMserver);
    this.socket = io(this.APMserver);

    
    
    console.log('socket ' + this.socket);
    this.socket.on('connect_failed', function() {
      console.log("connection failed!!");
   });
   this.socket.on('connect', function() {
    console.log("connection OK!!");
    });
    this.socket.on("welcome", (message) => {
      console.log('niets!!');
               this.presentAlert(message);
               console.log(message);
    });  

     authenticationService.getUser()
      .then(
        data => {
          this.getActivePatient(data.email);
        });
    //get the Acive Patient by ajax
    
    

    
    
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

  presentAlert(title) {
  let alert = this.alertCtrl.create({
    title: title
   
  });
  alert.present();
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

  getImage() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.myphoto = 'data:image/jpeg;base64,' + imageData;
      this.uploadImage();
    }, (err) => {
      // Handle error
    });
  }

  cropImage() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit:true,
      targetWidth:300,
      targetHeight:300
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.myphoto = 'data:image/jpeg;base64,' + imageData;
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
      params:{'patientID':this.patientID}
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

 

}
