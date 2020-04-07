
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
// import {Observable} from 'rxjs';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ClipsService} from '../clipsservice/clips.service';

// import {Clip} from '../_helpers/clip';
// import {ClipService} from '../_services/clip.service';
// import {NgbdSortableHeader, SortEvent} from '../_helpers/sortable.directive';

@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.css']
})
export class RecordingComponent implements OnInit {

  clipsDB: Array<any> = [];

  constructor(private clipService: ClipsService, public ngxSmartModalService: NgxSmartModalService) {}

  ngOnInit() {
    this.onGetClips();
  }

  onGetClips() {
    this.clipService.getClips().subscribe((data:any[])=>{
      this.clipsDB = data;
      console.log(this.clipsDB);
    });
  }

  // clips$: Observable<Clip[]>;
  // total$: Observable<number>;

  // @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  // constructor(public service: ClipService,
  //   public ngxSmartModalService: NgxSmartModalService) {
  //   this.clips$ = service.clips$;
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

}
