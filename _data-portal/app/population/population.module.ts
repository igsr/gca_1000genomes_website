import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { PopulationHomeComponent }  from './population-home.component';
import { PopulationDetailComponent }  from './population-detail.component';
import { PopulationSamplesComponent }  from './population-samples.component';
import { PopulationDataCollectionTableComponent }  from './population-data-collection-table.component';
import { PopulationAnalysisGroupTableComponent }  from './population-analysis-group-table.component';
import { PopulationMapComponent }  from './population-map.component';
import { PopulationMapKeyComponent }  from './population-map-key.component';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ 
    PopulationHomeComponent,
    PopulationDetailComponent,
		PopulationMapComponent,
		PopulationMapKeyComponent,
    PopulationSamplesComponent,
    PopulationDataCollectionTableComponent,
    PopulationAnalysisGroupTableComponent,
  ],
})
export class PopulationModule { };
