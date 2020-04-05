
import { Injectable, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json"}),
};

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {Camera} from '../_helpers/camera';
import {Cameras} from './../_helpers/cameras';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortDirection} from '../_helpers/sortable.directive';

interface SearchResult {
  cameras: Camera[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(cameras: Camera[], column: string, direction: string): Camera[] {
  if (direction === '') {
    return cameras;
  } else {
    return [...cameras].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(cameras: Camera, term: string, pipe: PipeTransform) {
  return cameras.cameraLocation.toLowerCase().includes(term.toLowerCase())
    || cameras.cameraClient.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(cameras.cameraID).includes(term);
}

@Injectable({
  providedIn: 'root'
})
export class CamerasService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _cameras$ = new BehaviorSubject<Camera[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 5,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private http: HttpClient) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._cameras$.next(result.cameras);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get cameras$() { return this._cameras$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
  
    // 1. sort
    let cameras = sort(Cameras, sortColumn, sortDirection);

    // 2. filter
    cameras = cameras.filter(camera => matches(camera, searchTerm, this.pipe));
    const total = cameras.length;

    // 3. paginate
    cameras = cameras.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({cameras, total});
  }
  
  // get all cameras
  getCameras() {
    return this.http.get('/cameras');
  }

  // get single camera
  getCamera(id: string) {
    let url = '/cameras/' + id;
    return this.http.get(url);
  }

  // create a new camera
  createCamera(data) {
    return this.http.post('/cameras', data, httpOptions);
  }

  // update a camera
  updateCamera(id, data) {
    let url = '/cameras/' + id;
    return this.http.put(url, data, httpOptions);
  }
}
