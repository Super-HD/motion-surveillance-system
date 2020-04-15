
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
// import {Observable} from 'rxjs';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ClipsService} from '../clipsservice/clips.service';
import { PaginationInstance} from 'ngx-pagination';

import { Clip } from "../../../../back-end-api/models/MotionClip"

// import {Clip} from '../_helpers/clip';
// import {ClipService} from '../_services/clip.service';
// import {NgbdSortableHeader, SortEvent} from '../_helpers/sortable.directive';


@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.css']
})
export class RecordingComponent implements OnInit {

  public clipsDB: Clip[] = [];
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
  filteredClips: Clip[] = []

  constructor(private clipService: ClipsService, public ngxSmartModalService: NgxSmartModalService) {
  }

  ngOnInit() {
    this.onGetClips();
    this.listFilter = '';
  }

  onGetClips() {
    this.clipService.getClips().subscribe((data:any[])=>{
      this.clipsDB = data;
      this.filteredClips = this.clipsDB
      console.log(this.clipsDB);
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
    this.filteredClips = this.listFilter ? this.doFilter(this.listFilter) : this.clipsDB;
  }

  doFilter(filterBy: string): Clip[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.clipsDB.filter((clip: Clip) =>
      clip.cameraID.toString(10).toLocaleLowerCase().indexOf(filterBy) !== -1 ||
      clip.recordingDate.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

}
