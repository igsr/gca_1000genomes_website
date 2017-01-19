import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { SampleHomeComponent }  from './sample-home.component';
import { SampleDataCollectionTableComponent }  from './sample-data-collection-table.component';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ 
    SampleHomeComponent,
    SampleDataCollectionTableComponent,
  ],
})
export class SampleModule { };
