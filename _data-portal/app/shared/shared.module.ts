import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiErrorComponent } from './components/api-error.component';
import { ApiSlowResponseComponent } from './components/api-slow-response.component';
import { PopulationFilterComponent } from './components/population-filter.component';

@NgModule({
  imports: [ CommonModule, RouterModule, FormsModule ],
  declarations: [ ApiErrorComponent, ApiSlowResponseComponent, PopulationFilterComponent ],
  exports: [ CommonModule, RouterModule, ApiErrorComponent, ApiSlowResponseComponent, PopulationFilterComponent ],
})
export class SharedModule { }
