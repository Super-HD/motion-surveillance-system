
import { Component, OnInit } from '@angular/core';
import { StreamingService } from './../streamingservice/streaming.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {
  // To-do: use camerasservice to get all cameras' port number
  // Each port number has its stream source
  streamSource: string = "http://localhost:5100";
  img: any;

  constructor(private streamingService: StreamingService) { }

  ngOnInit() {
    this.streamingService.getStream(this.streamSource).subscribe((img) => {
      this.img = "data:image/jpeg;base64,"+ img;
    })

  }

}
