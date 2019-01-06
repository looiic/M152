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
    //immer wenn man auf die view kommt songs neu laden --> vielleicht ist ja ein neuer dazu gekommen wenn man von der uploadpage kommt
    this.getSongs().then(data => {
      this.songs = data;
    })
  }

  //funktion die die "song" variabel füllt mit allen songs die auf der DB sind
  getSongs() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl+'/song').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  //auf die uploadpage navigieren
  uploadSong() {
    this.navCtrl.push(UploadPage);
  }

//funktion, die die suche handelt
  onSearch(){
      this.http.get(this.apiUrl+'/song/' + this.search).subscribe(data => {
        this.songs = data;
      }, err => {
        console.log(err);
      });
  }

}
