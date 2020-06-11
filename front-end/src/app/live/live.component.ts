
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

  camerasDB: Camera[] = [];  // An array stores obtained cameras from database
  camerasObj = []  // An array of length 3, it is used to store three camera object that will be diplayed in a row
  // A camera object which contains three values
  cameraObj = {
    URL: "",
    Client: "",
    Location: ""
  }

  constructor(private streamingService: StreamingService, private cameraService: CamerasService) { }

  ngOnInit() {
    this.onGetStreams();
  }

  /**
   * Start camera streaming 
   */
  onGetStreams() {
    this.cameraService.getCameras().subscribe((data: any[]) => {
      // Get all cameras documents from MongoDB database
      this.camerasDB = data;
      // Create a new empty array of length 3
      // Append this new empty array to camerasObj
      for (let i = 0; i <= this.camerasDB.length / 3; i++) {
        this.camerasObj.push([]);
      }
      // Create camera object using camera's info, put it in the nested array in camerasObj
      for (let i = 0; i < this.camerasDB.length; i++) {
        this.camerasObj[Math.floor(i / 3)][i % 3] = {
          URL: "",
          Client: this.camerasDB[i].cameraClient.clientName,
          Location: this.camerasDB[i].cameraLocation
        };
      }
      for (let i = 0; i < this.camerasDB.length; i++) {
        // Get camera streaming frame image calling getStream function
        this.streamingService.getStream(this.camerasDB[i].cameraURL).subscribe(img => {
          this.camerasObj[Math.floor(i / 3)][i % 3].URL = "data:image/jpeg;base64," + img;
        })
      }
    });
  }
}
