import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { PictureproofPage } from '../pictureproof/pictureproof';
import { DocscanPage } from '../docscan/docscan';



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
