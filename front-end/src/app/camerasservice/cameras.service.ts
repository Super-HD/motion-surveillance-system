/*
Created by Cheng Zeng
Updated on 05/06/2020
The camera service is responsible for the communication with the RESTFul server regarding Camera.
All functions provided in this file are used to perform operation on 
Camera data in the database.
*/

import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json"}),
};

@Injectable({
  providedIn: 'root'
})

export class CamerasService {
  
  // HttpClient provides HTTP service
  constructor(private http: HttpClient) {}

  // get all cameras
  getCameras() {
    return this.http.get('/cameras');
  }

  // get single camera
  getCamera(id: string) {
    let url = '/cameras/' + id;
    return this.http.get(url);
  }

  // create a new camera
  createCamera(data) {
    return this.http.post('/cameras', data, httpOptions);
  }

  // update a camera
  updateCamera(id, data) {
    let url = '/camera/' + id;
    return this.http.put(url, data, httpOptions);
  }

}
