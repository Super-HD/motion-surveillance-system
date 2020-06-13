/*
Created by Cheng Zeng
Updated on 11/06/2020
The clip service is responsible for the communication with the RESTFul server regarding Clip.
All functions provided in this file are used to perform operation on Client document in the database.
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

  /**
   * Get clip objects from MongoDB database
   * @return An Observable of the response with an array of clip json objects
   */
  getClips() {
    return this.http.get('/clips');
  }

  /**
   * Get a single clip object from MongoDB database
   * @param {string} id Clip ID used to search for a clip
   * @return An Observable of the response with a clip json object
   */
  getClip(id) {
    let url = '/clip/' + id;
    return this.http.get(url);
  }

  /**
   * Create a new clip document in MongoDB database
   * @param {JSON Object} data A clip json object
   * @return An Observable of the response
   */
  createClip(data) {
    return this.http.post('/clip', data, httpOptions);
  }

  /**
   * Update a clip document in MongoDB database
   * @param {string} id Clip ID used to search for a clip
   * @param {JSON Object} data A json object used to update the clip
   * @return An Observable of the response
   */
  updateClip(id, data) {
    let url = '/clip/' + id;
    return this.http.put(url, data, httpOptions);
  }

   /**
    * Delete a clip document in MongoDB database
    * @param {string} id Clip ID used to find a clip
    * @return An Observable of the response
    */
  deleteClip(id) {
    let url = '/clip/' + id;
    return this.http.delete(url, httpOptions);
  }
}

