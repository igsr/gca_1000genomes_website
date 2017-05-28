import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'ng4-popover';

import { ApiErrorComponent } from './components/api-error.component';
import { ApiSlowResponseComponent } from './components/api-slow-response.component';
import { PopulationFilterComponent } from './components/population-filter.component';
import { AnalysisGroupFilterComponent } from './components/analysis-group-filter.component';
import { DataCollectionFilterComponent } from './components/data-collection-filter.component';
import { SelectDcTabsComponent } from './components/select-dc-tabs.component';
import { DataCollectionFilesComponent } from './components/data-collection-files.component';

@NgModule({
  imports: [ CommonModule, RouterModule, FormsModule, PopoverModule ],
  declarations: [ ApiErrorComponent, ApiSlowResponseComponent, PopulationFilterComponent, AnalysisGroupFilterComponent, DataCollectionFilterComponent, SelectDcTabsComponent, DataCollectionFilesComponent ],
  exports: [ CommonModule, RouterModule, FormsModule, PopoverModule, ApiErrorComponent, ApiSlowResponseComponent, PopulationFilterComponent, AnalysisGroupFilterComponent, DataCollectionFilterComponent, SelectDcTabsComponent, DataCollectionFilesComponent ],
})
export class SharedModule { }
