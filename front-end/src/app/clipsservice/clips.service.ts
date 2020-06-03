/*
Created by Cheng Zeng
Updated on 04/06/2020
The clip service is responsible for the communication with the RESTFul server regarding Clip.
All functions provided in this file are used to perform operation on 
Client data in the database.
*/

import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json"}),
};

@Injectable({
  providedIn: 'root'
})
export class ClipsService {

  // HttpClient provides HTTP service
  constructor(private http: HttpClient) { }

  // get all clips
  getClips() {
    return this.http.get('/clips');
  }

  // get single clip
  getClip(id) {
    let url = '/clips/' + id;
    return this.http.get(url);
  }

  // create a new clip
  createClip(data) {
    return this.http.post('/clips', data, httpOptions);
  }

  // update a clip
  updateClip(id, data) {
    let url = '/clips/' + id;
    return this.http.put(url, data, httpOptions);
  }

   // delete a clip
   deleteClip(id) {
    let url = '/clip/' + id;
    return this.http.delete(url, httpOptions);
  }
}
