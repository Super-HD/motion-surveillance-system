import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 

// import ngx-smart-modal
// Keep these package that may be used in future to implement watching motion-detection video online
import { NgxSmartModalModule } from 'ngx-smart-modal';
// import for mat-video
// Keep these package that may be used in future to implement watching motion-detection video online
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatVideoModule } from 'mat-video';
// import ngx-pagination
import { NgxPaginationModule} from 'ngx-pagination'
// import confirmation popover
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

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
    ManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxSmartModalModule.forRoot(),
    BrowserAnimationsModule,
    MatVideoModule,
    HttpClientModule,
    NgxPaginationModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    })
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
