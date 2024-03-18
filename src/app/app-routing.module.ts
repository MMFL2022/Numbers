import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumberDisplayComponent } from './number-display/number-display.component';
import { TimeDisplayComponent } from './time-display/time-display.component';

const routes: Routes = [
  {
    path: 'numbers',
    component: NumberDisplayComponent
  },
  {
    path: 'time',
    component: TimeDisplayComponent
  },
  {
    path: '',
    component: NumberDisplayComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
