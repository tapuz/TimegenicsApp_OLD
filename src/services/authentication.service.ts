import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http, Headers } from '@angular/http';
import * as Config from '../config';
//import { Storage } from '@ionic/storage';

@Injectable()
export class AuthenticationService {

  constructor(
    public nativeStorage: NativeStorage,
    public http: Http,
    //private storage: Storage
  ){}

  getUser(){
    //return this.storage.get('User');
    console.log('getting the user !!');
    return this.nativeStorage.getItem('User');
  }

  setUser(user){
    return this.nativeStorage.setItem('User', user)
    .then(
      () => console.log('here is the user: ' + this.nativeStorage.getItem('User')),
      error => console.error('Error storing item', error)
    );
    //return this.storage.set('User', user);

  }

  logOut(){
    return this.nativeStorage.clear();
  }

  doLogin(username, password){
    //return this.http.post(Config.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token',{
    return this.http.post('https://www.timegenics.com/wp-json/jwt-auth/v1/token',{  
      username: username,
      password: password
    })
  }

  doRegister(user_data, token){
    return this.http.post(Config.WORDPRESS_REST_API_URL + 'users?token=' + token, user_data);
  }

  validateAuthToken(token){
    let header : Headers = new Headers();
    header.append('Authorization','Bearer ' + token);
    return this.http.post(Config.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token/validate',
      {}, {headers: header})
  }
}