import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {
  file: File;
  songname: string;
  interpret: string;
  apiUrl = 'http://localhost:3000';
  spinner: any;


  constructor(public navCtrl: NavController, public http: HttpClient, public loadingCtrl: LoadingController, private toastCtrl: ToastController) {
  }

  changeListener($event) : void {
     this.file = $event.target.files[0];
     if(this.file.size > 10000000){
       this.file = null;
       let toast = this.toastCtrl.create({
         message: 'Maximum 10 MB allowed',
         duration: 3000,
         position: 'bottom'
       });
       toast.present();
     }
   }

  createSpinner() {
  this.spinner = this.loadingCtrl.create({
    content: 'Upload and convert song'
  });

  this.spinner.present();

}

hideSpinner(){
  this.spinner.dismiss();
}

  upload() {
    this.createSpinner()
    let body = new FormData();
    body.append('titel', this.songname);
    body.append('interpret', this.interpret);
    body.append('song', this.file);

   this.http.post(this.apiUrl + '/song', body)
  .subscribe(res => {
    console.log(res);
    this.hideSpinner();
    this.navCtrl.pop();
    }, (err) => {
      this.hideSpinner();
    });
  }

}
