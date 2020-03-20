import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DecimalPipe} from '@angular/common';

import {CountryService} from './_services/country.service';
import { NgbdSortableHeader } from './_helpers/sortable.directive';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LiveComponent } from './live/live.component';
import { RecordingComponent } from './recording/recording.component';
import { ManagementComponent } from './management/management.component';

@NgModule({
  declarations: [
    AppComponent,
    LiveComponent,
    RecordingComponent,
    ManagementComponent,
    NgbdSortableHeader
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule

  ],
  providers: [CountryService, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
