
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

  id: any;  // A variable that stores camera's id temporarily
  cameraClient: any;  // A variable that stores camera's client temporarily
  cameraLocation: string; // A variable that stores camera's location temporarily
  startTime = {hour: 0, minute: 0};  // An object that sotres camera motion active start time temporarily
  endTime = {hour: 0, minute: 0};  // An object that stores camera motion active end time temporarily

  public camerasDB: Camera[] = [];  // An array stores obtained cameras from database

  // Pagination-controls configuration
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

  constructor(private cameraService: CamerasService, 
    private http: HttpClient,
    public fb: FormBuilder){
  };

  ngOnInit() {
    this.onGetCameras();
    this.listFilter = '';  // set listFilter to call filter functions
  }
  
  /**
   * Get all camera documents
   */
  onGetCameras() {
    this.cameraService.getCameras().subscribe((data:any[])=>{
      this.camerasDB = data;
      this.filteredCameras = this.camerasDB;
      console.log(this.camerasDB);
    });
  }

  // ngx-pagination
  // From http://michaelbromley.github.io/ngx-pagination/#/advanced
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

  // Filter
  // variables for filter
  _listFilter = "";
  filteredCameras: Camera[] = []

  /**
   * Getter function, get _listFilter
   */
  get listFilter(): string {
    return this._listFilter;
  }

  /** 
   * Setter function, do filter when there is anattempt to set listFilter
   */
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredCameras = this.listFilter ? this.doFilter(this.listFilter) : this.camerasDB;
  }
  
  /**
   * Filter Cameras using keyword 
   * @param {string} filterBy Filter keyword
   * @return The cameras of an array that meet the condition specified in a callback function
   */
  doFilter(filterBy: string): Camera[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.camerasDB.filter((camera: Camera) =>
        camera.cameraClient.clientName.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        camera._id.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
        camera.cameraLocation.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  /**
   * Assign values to defined values regarding camera
   * @param {JSON Objec} camera A camera json object
   */
  onSelectUpdate(camera){
    this.cameraLocation = camera.cameraLocation;
    this.startTime = {hour: Number(camera.startTime.hour), minute: Number(camera.startTime.minute)};
    this.endTime = {hour: Number(camera.endTime.hour), minute: Number(camera.endTime.minute)};
    this.id = camera._id;
  }

  /**
   * Updata a camera document
   */
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

  /**
   * Convert a NgbTimeStruct value into CustomTimeStruct value in order to store time info
   * @param {NgbTimeStruct} time A time NgbTimeStruct
   * @return The CustomTimeStruct converted from input param
   */
  toModel(time: NgbTimeStruct | null): CustomTimeStruct | null {
    return (time && Number.isInteger(time.hour) && Number.isInteger(time.minute)) ?
        {hour: ("0" + time.hour).slice(-2), minute: ("0" + time.minute).slice(-2)} :
        null;
  }
}
