import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { DataCollectionHomeComponent }  from './data-collection-home.component';
import { DataCollectionDetailComponent }  from './data-collection-detail.component';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ 
    DataCollectionHomeComponent,
    DataCollectionDetailComponent,
  ],
})
export class DataCollectionModule { };
