import { AppComponent } from './app.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordingComponent } from './recording/recording.component';
import { ManagementComponent } from './management/management.component';
import { LiveComponent } from './live/live.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'live',
    pathMatch: 'full'
  },
  {
    path: 'live',
    component: LiveComponent
  },
  {
    path: 'recording',
    component: RecordingComponent
  },
  {
    path: 'management',
    component: ManagementComponent
  },
  {
    path: '**', redirectTo: ''
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
