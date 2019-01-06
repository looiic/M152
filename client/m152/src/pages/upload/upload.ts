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

//wenn jemand einen song ausgewählt hat
  changeListener($event) : void {
     this.file = $event.target.files[0];
     //prüfen ob der song nicht grösser als 10 mb ist
     if(this.file.size > 10000000){
       //der song ist grösser als 10bm also variabel zurücksetzen und meldung an user geben
       this.file = null;
       let toast = this.toastCtrl.create({
         message: 'Maximum 10 MB allowed',
         duration: 3000,
         position: 'bottom'
       });
       toast.present();
     }
   }

//funktion welche einen loadingspinner erstellt
  createSpinner() {
  this.spinner = this.loadingCtrl.create({
    content: 'Upload and convert song'
  });

  this.spinner.present();

}

//funktion, welche den loadingspinner wieder versteckt
hideSpinner(){
  this.spinner.dismiss();
}

//funktion, die den upload handelt
  upload() {
    this.createSpinner()

    //body aufbereiten
    let body = new FormData();
    body.append('titel', this.songname);
    body.append('interpret', this.interpret);
    body.append('song', this.file);

//post request an den server
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
