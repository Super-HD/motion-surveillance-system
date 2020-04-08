

import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import {Observable} from 'rxjs';

// import { Camera } from './../_helpers/camera';
// import { CameraService } from './../_services/camera.service';
// import {NgbdSortableHeader, SortEvent} from '../_helpers/sortable.directive';
import {CamerasService} from '../camerasservice/cameras.service'
import {NgbTimeStruct} from '../_helpers/ngb-time-struct';
import { CustomTimeStruct } from './../_helpers/custom-time-struct';



@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})

export class ManagementComponent implements OnInit {

  id: string;
  cameraID: number;
  cameraClient: string;
  cameraLocation: string;

  startTime = {hour: 0, minute: 0};
  endTime = {hour: 0, minute: 0};

  camerasDB: Array<any> = [];
  
  constructor(private cameraService: CamerasService, private http: HttpClient){};

  ngOnInit() {
    this.onGetCameras();
  }

  onGetCameras() {
    this.cameraService.getCameras().subscribe((data:any[])=>{
      this.camerasDB = data;
      console.log(this.camerasDB);
    });
  }

  // cameras$: Observable<Camera[]>;
  // total$: Observable<number>;

  // @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  // constructor(public service: CameraService) {
  //   this.cameras$ = service.cameras$;
  //   this.total$ = service.total$;
  // }

  // onSort({column, direction}: SortEvent) {
  //   // resetting other headers
  //   this.headers.forEach(header => {
  //     if (header.sortable !== column) {
  //       header.direction = '';
  //     }
  //   });
  //   this.service.sortColumn = column;
  //   this.service.sortDirection = direction;
  // }

  onSelectUpdate(camera){
    this.cameraID = camera.cameraID;
    this.cameraClient = camera.cameraClient;
    this.cameraLocation = camera.cameraLocation;
    this.startTime = {hour: Number(camera.startTime.hour), minute: Number(camera.startTime.minute)};
    this.endTime = {hour: Number(camera.endTime.hour), minute: Number(camera.endTime.minute)};
    this.id = camera._id;
  }

  onUpdateCamera(){
    let obj = {
      // cameraID cannot be changed
      //cameraID: this.cameraID,
      cameraClient: this.cameraClient,
      cameraLocation: this.cameraLocation,
      startTime: this.toModel(this.startTime),
      endTime: this.toModel(this.endTime)
    };
    this.cameraService.updateCamera(this.id, obj).subscribe(result => {
      this.onGetCameras();
    });
  }

  /**
   * Converts a NgbTimeStruct value into CustomTimeStruct value
   */
  toModel(time: NgbTimeStruct | null): CustomTimeStruct | null {
    return (time && Number.isInteger(time.hour) && Number.isInteger(time.minute)) ?
        {hour: ("0" + time.hour).slice(-2), minute: ("0" + time.minute).slice(-2)} :
        null;
  }

}
