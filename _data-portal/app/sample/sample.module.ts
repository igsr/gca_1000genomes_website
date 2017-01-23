import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SampleHomeComponent }  from './sample-home.component';
import { SampleDetailComponent }  from './sample-detail.component';
import { SampleDataCollectionsComponent }  from './sample-data-collections.component';
import { SampleDataCollectionTableComponent }  from './sample-data-collection-table.component';
import { SampleAnalysisGroupTableComponent }  from './sample-analysis-group-table.component';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ 
    SampleHomeComponent,
    SampleDetailComponent,
    SampleDataCollectionsComponent,
    SampleDataCollectionTableComponent,
    SampleAnalysisGroupTableComponent,
  ],
})
export class SampleModule { };
