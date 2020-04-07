import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json"}),
};

@Injectable({
  providedIn: 'root'
})
export class ClipsService {

  constructor(private http: HttpClient) { }

  // get all clips
  getClips() {
    return this.http.get('/clips');
  }

  // get single clip
  getClip(id) {
    let url = '/clips/' + id;
    return this.http.get(url);
  }

  // create a new clip
  createClip(data) {
    return this.http.post('/clips', data, httpOptions);
  }

  // update a clip
  updateClip(id, data) {
    let url = '/clips/' + id;
    return this.http.put(url, data, httpOptions);
  }
}
