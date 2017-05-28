import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SampleHomeComponent }  from './sample-home.component';
import { SampleDetailComponent }  from './sample-detail.component';
import { SampleDataCollectionTableComponent }  from './sample-data-collection-table.component';
import { SampleAnalysisGroupTableComponent }  from './sample-analysis-group-table.component';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ 
    SampleHomeComponent,
    SampleDetailComponent,
    SampleDataCollectionTableComponent,
    SampleAnalysisGroupTableComponent,
  ],
})
export class SampleModule { };
