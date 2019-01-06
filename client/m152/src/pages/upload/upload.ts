import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

   changeListener($event) : void {
      this.file = $event.target.files[0];
    }
  constructor(public navCtrl: NavController, public http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
  }

  upload() {
    let body = new FormData();
    body.append('titel', this.songname);
    body.append('interpret', this.interpret);
    body.append('song', this.file);

   this.http.post(this.apiUrl + '/song', body)
  .subscribe(res => {
    console.log(res);
    }, (err) => {
      //reject(err);
    });
  }

}
