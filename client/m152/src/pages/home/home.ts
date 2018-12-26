import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  apiUrl = 'http://localhost:3005';

  songs: any;

  constructor(public navCtrl: NavController, public http: HttpClient) {
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

}
