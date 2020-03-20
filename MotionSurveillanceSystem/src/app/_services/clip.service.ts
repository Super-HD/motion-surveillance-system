import {Injectable, PipeTransform} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';

import {Clip} from '../_helpers/clip';
import {Clips} from '../_helpers/clips';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortDirection} from '../_helpers/sortable.directive';

interface SearchResult {
  clips: Clip[];
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

function sort(clips: Clip[], column: string, direction: string): Clip[] {
  if (direction === '') {
    return clips;
  } else {
    return [...clips].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(clip: Clip, term: string, pipe: PipeTransform) {
  return clip.cameraLocation.toLowerCase().includes(term.toLowerCase())
    || clip.recordingDate.toLowerCase().includes(term.toLowerCase())
    || clip.cameraClient.toLowerCase().includes(term.toLowerCase())
    || pipe.transform(clip.cameraID).includes(term);
}

@Injectable({providedIn: 'root'})
export class ClipService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _clips$ = new BehaviorSubject<Clip[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 5,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._clips$.next(result.clips);
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get clips$() { return this._clips$.asObservable(); }
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
    let clips = sort(Clips, sortColumn, sortDirection);

    // 2. filter
    clips = clips.filter(clip => matches(clip, searchTerm, this.pipe));
    const total = clips.length;

    // 3. paginate
    clips = clips.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({clips, total});
  }
}
