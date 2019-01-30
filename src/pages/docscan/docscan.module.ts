import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocscanPage } from './docscan';

@NgModule({
  declarations: [
    DocscanPage,
  ],
  imports: [
    IonicPageModule.forChild(DocscanPage),
  ],
})
export class DocscanPageModule {}
