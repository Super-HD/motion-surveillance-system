
import { Component, OnInit } from '@angular/core';
import { StreamingService } from './../streamingservice/streaming.service';
import { CamerasService } from '../camerasservice/cameras.service';
import { Camera } from "../../../../back-end/models/Camera";
import { CompileMetadataResolver } from '@angular/compiler';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {
  camerasDB: Camera[] = [];
  camerasURL = [];

  constructor(private streamingService: StreamingService, private cameraService: CamerasService) { }

  ngOnInit() {
    this.onGetStreams();
  }
  // To-do: show camera info 
  onGetStreams() {
    this.cameraService.getCameras().subscribe((data:any[])=>{
      this.camerasDB = data;
      console.log(this.camerasDB);
      for (let i = 0; i <= this.camerasDB.length/3; i++){
        this.camerasURL.push([])
      }
      // var temp = [];
      for (let i = 0; i < this.camerasDB.length; i++) {
        console.log(i/3);
        this.streamingService.getStream(this.camerasDB[i].cameraURL).subscribe(img => {
          this.camerasURL[Math.floor(i/3)][i%3] = "data:image/jpeg;base64,"+ img;
        })
      }
    });
    console.log(this.camerasURL);
  }
}
