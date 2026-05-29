import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiErrorComponent } from './components/api-error.component';
import { ApiSlowResponseComponent } from './components/api-slow-response.component';
import { PopulationFilterComponent } from './components/population-filter.component';
import { AnalysisGroupFilterComponent } from './components/analysis-group-filter.component';
import { DataCollectionFilterComponent } from './components/data-collection-filter.component';
import { SelectDcTabsComponent } from './components/select-dc-tabs.component';
import { DataCollectionFilesComponent } from './components/data-collection-files.component';
import { PopoverDirective } from './components/popover.directive';

@NgModule({
  imports: [ CommonModule, RouterModule, FormsModule ],
  declarations: [ ApiErrorComponent, ApiSlowResponseComponent, PopulationFilterComponent, AnalysisGroupFilterComponent, DataCollectionFilterComponent, SelectDcTabsComponent, DataCollectionFilesComponent, PopoverDirective ],
  exports: [ CommonModule, RouterModule, FormsModule, ApiErrorComponent, ApiSlowResponseComponent, PopulationFilterComponent, AnalysisGroupFilterComponent, DataCollectionFilterComponent, SelectDcTabsComponent, DataCollectionFilesComponent, PopoverDirective ],
})
export class SharedModule { }
