import { NgModule }      from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { DataCollectionHomeComponent }  from './data-collection-home.component';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ 
    DataCollectionHomeComponent,
  ],
})
export class DataCollectionModule { };
