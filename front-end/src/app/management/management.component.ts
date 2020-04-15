
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationInstance} from 'ngx-pagination';
// import {Observable} from 'rxjs';

// import { Camera } from './../_helpers/camera';
// import { CameraService } from './../_services/camera.service';
// import {NgbdSortableHeader, SortEvent} from '../_helpers/sortable.directive';
import { Camera } from "../../../../back-end-api/models/Camera"
import { CamerasService } from '../camerasservice/cameras.service'
import { NgbTimeStruct } from '../_helpers/ngb-time-struct';
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

  public camerasDB: Camera[] = [];
  // variables for pagination
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = false;
  public config: PaginationInstance = {
      id: 'management',
      itemsPerPage: 5,
      currentPage: 1
  };
  public labels: any = {
    previousLabel: 'Previous',
    nextLabel: 'Next',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };
  public eventLog: string[] = [];

  // variables for filter
  _listFilter = "";
  filteredCameras: Camera[] = []

  constructor(private cameraService: CamerasService, private http: HttpClient){
  };

  ngOnInit() {
    this.onGetCameras();
    this.listFilter = '';
  }

  onGetCameras() {
    this.cameraService.getCameras().subscribe((data:any[])=>{
      this.camerasDB = data;
      this.filteredCameras = this.camerasDB;
      console.log(this.camerasDB);
    });
  }
  // Pagination functions
  onPageChange(number: number) {
    this.logEvent(`pageChange(${number})`);
    this.config.currentPage = number;
  }

  onPageBoundsCorrection(number: number) {
      this.logEvent(`pageBoundsCorrection(${number})`);
      this.config.currentPage = number;
  }

  private logEvent(message: string) {
    this.eventLog.unshift(`${new Date().toISOString()}: ${message}`)
  }

  // Filter functions
  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredCameras = this.listFilter ? this.doFilter(this.listFilter) : this.camerasDB;
  }
  
  doFilter(filterBy: string): Camera[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.camerasDB.filter((camera: Camera) =>
        camera.cameraClient.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        camera.cameraID.toString(10).toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        camera.cameraLocation.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  // Search(filter) {
  //   if (this.filter != "") {
  //     this.camerasDB = this.camerasDB.filter(res => {
  //       return res.cameraID.toString(10).toLocaleLowerCase().match(filter.toLocaleLowerCase())
  //       || res.cameraLocation.toLocaleLowerCase().match(filter.toLocaleLowerCase())
  //       || res.cameraClient.toLocaleLowerCase().match(filter.toLocaleLowerCase());
  //    });
  //   } else {
  //     this.onGetCameras()
  //   }
    
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
