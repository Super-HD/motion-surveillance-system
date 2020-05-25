/*
Created by Cheng Zeng
Updated on 25/05/2020
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

  // this may need to change to be a HTTP get request which continually ask server for frames.
  public getStream(url: string) {
    return Observable.create((observable) => {
      var socket = io.connect(url);
      socket.on('buildingAFrame', (img) => {
        observable.next(img);
      });
    })
  }
}
