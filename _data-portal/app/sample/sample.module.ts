import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SampleHomeComponent }  from './sample-home.component';
import { SampleDatasetTableComponent }  from './sample-dataset-table.component';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ 
    SampleHomeComponent,
    SampleDatasetTableComponent,
  ],
})
export class SampleModule { };
