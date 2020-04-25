import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as io from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class StreamingService {

  constructor() { }

  public getStream(url: string) {
    return Observable.create((observable) => {      
      var socket = io.connect(url);
      socket.on('buildingAFrame', (img) => {
        observable.next(img);
      });
    })
  }

}
