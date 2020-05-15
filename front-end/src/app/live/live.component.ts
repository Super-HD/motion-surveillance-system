
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
  camerasObj = []
  cameraObj = {}

  constructor(private streamingService: StreamingService, private cameraService: CamerasService) { }

  ngOnInit() {
    this.onGetStreams();
  }
  // To-do: show camera info 
  onGetStreams() {
    this.cameraService.getCameras().subscribe((data:any[])=>{
      this.camerasDB = data;
      for (let i = 0; i <= this.camerasDB.length/3; i++){
        this.camerasObj.push([]);
      }
      for (let i = 0; i < this.camerasDB.length; i++) {
        this.streamingService.getStream(this.camerasDB[i].cameraURL).subscribe(img => {
          this.cameraObj = {URL: "data:image/jpeg;base64,"+ img, 
                          Client: this.camerasDB[i].cameraClient.clientName, 
                          Location: this.camerasDB[i].cameraLocation};
          this.camerasObj[Math.floor(i/3)][i%3] = this.cameraObj;
        })
      }
    });
  }
}
