import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AlertController } from 'ionic-angular';
import * as Config from '../../config';
import * as io from 'socket.io-client';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  base64Image:any;
  myphoto:any;
  pictures=[];
  patientID:any;
  data:any;
  socket:any;
  APMserver= "http://192.168.0.2:3000";
  footermsg = "system ready...";

  constructor(public navCtrl: NavController, private camera: Camera, private transfer: FileTransfer, private loadingCtrl:LoadingController,private alertCtrl: AlertController) {
    //console.log("this is the shit: ", this.APMserver);
    //this.socket = io(this.APMserver);
    //this.socket.on("welcome", (message) => {
     //          this.presentAlert(message);
      //         console.log(message);
    //});  


  }

  presentAlert(title) {
  let alert = this.alertCtrl.create({
    title: title
    //subTitle: '10% of battery remaining',
    //buttons: ['Dismiss']
  });
  alert.present();
  }

  takePhoto(){
    //check if patientID was enteredfdfsd
    const options: CameraOptions = {
      quality: 70,
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

        loader.dismiss();
      });
    
  }

 

}
