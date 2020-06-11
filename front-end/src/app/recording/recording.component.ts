
import { Component, OnInit} from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ClipsService} from '../clipsservice/clips.service';
import { PaginationInstance} from 'ngx-pagination';

import { MotionClip } from "../../../../back-end/models/MotionClip"

@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.css']
})
export class RecordingComponent implements OnInit {

  public clipsDB: MotionClip[] = [];  // An array stores obtained clips from database

  // Confirmation popover configuration
  popoverTitle: string = "Clip Delete Confirmation";
  popoverMessage: string = "Do you want to delete?";
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;

  // Pagination-controls configuration
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = false;
  public config: PaginationInstance = {
      id: 'recording',
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

  constructor(private clipService: ClipsService, public ngxSmartModalService: NgxSmartModalService) {
  }

  ngOnInit() {
    this.onGetClips();
    this.listFilter = ''; // set listFilter to call filter functions
  }

  /**
   * Get all clip documents
   */
  onGetClips() {
    this.clipService.getClips().subscribe((data:any[])=>{
      this.clipsDB = data;
      this.filteredClips = this.clipsDB
    });
  }

  /**
   * Delete a clip document 
   * @param clipID A clip ID used to find a clip
   */
  onDeleteClip(clipID) {
    this.clipService.deleteClip(clipID).subscribe(result => {
      this.onGetClips();
    })
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
  filteredClips: MotionClip[] = []

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
    this.filteredClips = this.listFilter ? this.doFilter(this.listFilter) : this.clipsDB;
  }

  /**
   * Filter Clips using keyword 
   * @param filterBy Filter keyword
   * @return The clips of an array that meet the condition specified in a callback function
   */
  doFilter(filterBy: string): MotionClip[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.clipsDB.filter((clip: MotionClip) =>
      clip.camera._id.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
      clip.camera.cameraLocation.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
      clip.camera.cameraClient.clientName.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
      clip.recordingDate.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

}
