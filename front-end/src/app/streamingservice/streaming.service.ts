/*
Created by Cheng Zeng
Updated on 11/06/2020
The streaming service is responsible for listenning on the streaming source.
*/

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as io from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class StreamingService {

  constructor() { }

  /**
   * Get Streming frame image
   * @param {string} url The url of socket server who publish frame image
   * @return An Observable of the frame image
   */
  public getStream(url: string) {
    return Observable.create((observable) => {
      var socket = io.connect(url);
      socket.on('buildingAFrame', (img) => {
        observable.next(img);
      });
    })
  }
}
