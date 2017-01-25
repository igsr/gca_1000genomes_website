import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { DataCollectionHomeComponent }  from './data-collection-home.component';
import { DataCollectionDetailComponent }  from './data-collection-detail.component';
import { DcSamplesComponent }  from './dc-samples.component';
import { DcPopulationsComponent }  from './dc-populations.component';
import { DcFilesComponent }  from './dc-files.component';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ 
    DataCollectionHomeComponent,
    DataCollectionDetailComponent,
    DcSamplesComponent,
    DcPopulationsComponent,
    DcFilesComponent,
  ],
})
export class DataCollectionModule { };
