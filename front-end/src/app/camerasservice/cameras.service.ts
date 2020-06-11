/*
Created by Cheng Zeng
Updated on 11/06/2020
The camera service is responsible for the communication with the RESTFul server regarding Camera.
All functions provided in this file are used to perform operation on Camera document in the database.
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

  
  /**
   * Get camera objects from MongoDB database
   * @return An Observable of the response with an array of camera json objects
   */
  getCameras() {
    return this.http.get('/cameras');
  }

  /**
   * Get a single camera object from MongoDB database
   * @param id Camera ID used to search for a camera
   * @return An Observable of the response with a camera json object
   */
  getCamera(id: string) {
    let url = '/camera/' + id;
    return this.http.get(url);
  }

  /**
   * Create a new camera document in MongoDB database
   * @param data A camera json object
   * @return An Observable of the response 
   */
  createCamera(data) {
    return this.http.post('/camera', data, httpOptions);
  }

  /**
   * Update a camera document in MongoDB database
   * @param id Camera ID used to search for a camera
   * @param data A json object used to update the camera
   * @return An Observable of the response
   */
  updateCamera(id, data) {
    let url = '/camera/' + id;
    return this.http.put(url, data, httpOptions);
  }

}
