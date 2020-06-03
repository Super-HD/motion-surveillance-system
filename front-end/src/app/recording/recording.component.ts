
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

  public clipsDB: MotionClip[] = [];

  // Confirmation popover setting
  popoverTitle: string = "Clip Delete Confirmation";
  popoverMessage: string = "Do you want to delete?";
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;

  // variables for pagination
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

  // variables for filter
  _listFilter = "";
  filteredClips: MotionClip[] = []

  constructor(private clipService: ClipsService, public ngxSmartModalService: NgxSmartModalService) {
  }

  ngOnInit() {
    this.onGetClips();
    this.listFilter = '';
  }

  // Get all recording clips' data from mongodb using camera service
  onGetClips() {
    this.clipService.getClips().subscribe((data:any[])=>{
      this.clipsDB = data;
      this.filteredClips = this.clipsDB
      console.log(this.clipsDB);
    });
  }

  // Delete clips from database
  onDeleteClip(clipID) {
    this.clipService.deleteClip(clipID).subscribe(result => {
      this.onGetClips();
    })
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
    this.filteredClips = this.listFilter ? this.doFilter(this.listFilter) : this.clipsDB;
  }

  doFilter(filterBy: string): MotionClip[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.clipsDB.filter((clip: MotionClip) =>
      clip.camera._id.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
      clip.camera.cameraLocation.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
      clip.camera.cameraClient.clientName.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
      clip.recordingDate.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

}
