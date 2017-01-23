import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SampleHomeComponent } from './sample/sample-home.component';
import { SampleDetailComponent } from './sample/sample-detail.component';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sample'},
  { path: 'sample', component: SampleHomeComponent},
  { path: 'sample/:sampleName', component: SampleDetailComponent},
  { path: 'population', component: SampleHomeComponent},
  { path: 'data-collection', component: SampleHomeComponent},
  { path: 'search', component: SampleHomeComponent},
  { path: '**', redirectTo: 'sample'},
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
