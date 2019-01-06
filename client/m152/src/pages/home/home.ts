import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { UploadPage } from '../upload/upload';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  apiUrl = 'http://localhost:3000';
  search: string;
  songs: any;

  constructor(public navCtrl: NavController, public http: HttpClient) {

  }
  ionViewWillEnter(){
    this.getSongs().then(data => {
      this.songs = data;
    })
  }

  getSongs() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/song').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  uploadSong() {
    this.navCtrl.push(UploadPage);
  }


  onSearch(){
      this.http.get(this.apiUrl+'/song/' + this.search).subscribe(data => {
        this.songs = data;
      }, err => {
        console.log(err);
      });
  }

}
