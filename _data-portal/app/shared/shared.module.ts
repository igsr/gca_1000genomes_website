import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiErrorComponent } from './components/api-error.component';
import { ApiSlowResponseComponent } from './components/api-slow-response.component';
import { PopulationFilterComponent } from './components/population-filter.component';
import { AnalysisGroupFilterComponent } from './components/analysis-group-filter.component';
import { DataCollectionFilterComponent } from './components/data-collection-filter.component';

@NgModule({
  imports: [ CommonModule, RouterModule, FormsModule ],
  declarations: [ ApiErrorComponent, ApiSlowResponseComponent, PopulationFilterComponent, AnalysisGroupFilterComponent, DataCollectionFilterComponent ],
  exports: [ CommonModule, RouterModule, ApiErrorComponent, ApiSlowResponseComponent, PopulationFilterComponent, AnalysisGroupFilterComponent, DataCollectionFilterComponent ],
})
export class SharedModule { }
