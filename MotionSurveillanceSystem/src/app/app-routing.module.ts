import { AppComponent } from './app.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RecordingComponent } from './recording/recording.component';
import { ManagementComponent } from './management/management.component';
import { LiveComponent } from './live/live.component';

const routes: Routes = [
  {
    path: '',
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
    path: 'login',
    component: LoginComponent
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
