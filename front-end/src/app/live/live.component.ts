
import { Component, OnInit } from '@angular/core';
import { StreamingService } from './../streamingservice/streaming.service';
import { CamerasService } from '../camerasservice/cameras.service';
import { Camera } from "../../../../back-end/models/Camera";

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {
  camerasDB: Camera[] = [];
  camerasObj = []
  cameraObj = {
    URL: "",
    Client: "",
    Location: ""
  }

  constructor(private streamingService: StreamingService, private cameraService: CamerasService) { }

  ngOnInit() {
    this.onGetStreams();
  }
  // To-do: hide cameras not running
  onGetStreams() {
    this.cameraService.getCameras().subscribe((data: any[]) => {
      // Get all cameras data form mongodb
      this.camerasDB = data;
      // Create a new empty array of length 3
      // Append this new empty array to camerasObj
      for (let i = 0; i <= this.camerasDB.length / 3; i++) {
        this.camerasObj.push([]);
      }
      // Create cameraOBj using camera's info, put it in the nested array in camerasObj
      for (let i = 0; i < this.camerasDB.length; i++) {
        this.camerasObj[Math.floor(i / 3)][i % 3] = {
          URL: "",
          Client: this.camerasDB[i].cameraClient.clientName,
          Location: this.camerasDB[i].cameraLocation
        };
      }
      for (let i = 0; i < this.camerasDB.length; i++) {
        // Get camera streaming using cameraURL from each camera object created below
        this.streamingService.getStream(this.camerasDB[i].cameraURL).subscribe(img => {
          this.camerasObj[Math.floor(i / 3)][i % 3].URL = "data:image/jpeg;base64," + img;
        })
      }
    });
  }
}
