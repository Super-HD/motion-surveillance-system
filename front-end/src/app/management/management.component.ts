
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationInstance} from 'ngx-pagination';
import { Camera } from "../../../../back-end/models/Camera";
import { CamerasService } from '../camerasservice/cameras.service';
import { NgbTimeStruct } from '../_helpers/ngb-time-struct';
import { CustomTimeStruct } from './../_helpers/custom-time-struct';

import { FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})

export class ManagementComponent implements OnInit {

  id: any;
  cameraClient: any;
  cameraLocation: string;

  startTime = {hour: 0, minute: 0};
  endTime = {hour: 0, minute: 0};
  
  // Confirmation popover setting
  popoverTitle: string = "Camera Delete Confirmation";
  popoverMessage: string = "Do you want to delete?";
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;

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

  constructor(private cameraService: CamerasService, 
    private http: HttpClient,
    public fb: FormBuilder){
  };

  ngOnInit() {
    this.onGetCameras();
    this.listFilter = '';
  }
  
  // Get all cameras' data from mongodb using camera service
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
        camera.cameraClient.clientName.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        camera._id.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        camera.cameraLocation.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  // Pre-fill text field for updating
  onSelectUpdate(camera){
    //this.cameraClient = camera.cameraClient.clientName;
    this.cameraLocation = camera.cameraLocation;
    this.startTime = {hour: Number(camera.startTime.hour), minute: Number(camera.startTime.minute)};
    this.endTime = {hour: Number(camera.endTime.hour), minute: Number(camera.endTime.minute)};
    this.id = camera._id;
  }

  // Update camera info in the database
  onUpdateCamera(){
    // Prepare the new camera obj which will be sent to database
    let obj = {
      cameraLocation: this.cameraLocation,
      startTime: this.toModel(this.startTime),
      endTime: this.toModel(this.endTime)
    };
    // Call updateCamera function in camera service
    this.cameraService.updateCamera(this.id, obj).subscribe(result => {
      this.onGetCameras();
    });
  }

  // Converts a NgbTimeStruct value into CustomTimeStruct value in order to store time info
  toModel(time: NgbTimeStruct | null): CustomTimeStruct | null {
    return (time && Number.isInteger(time.hour) && Number.isInteger(time.minute)) ?
        {hour: ("0" + time.hour).slice(-2), minute: ("0" + time.minute).slice(-2)} :
        null;
  }
}
