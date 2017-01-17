import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './core/components/home.component';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sample'},
  { path: 'sample', component: HomeComponent},
  { path: 'population', component: HomeComponent},
  { path: 'data-collection', component: HomeComponent},
  { path: 'search', component: HomeComponent},
  { path: '**', redirectTo: 'sample'},
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
